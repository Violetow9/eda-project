import { Injectable, Logger } from '@nestjs/common';
import * as net from 'node:net';
import * as tls from 'node:tls';
import { once } from 'node:events';
import {
  NotificationChannel,
  NotificationChannelType,
  NotificationType,
} from '../../domain/notification-channel.interface';

@Injectable()
export class SmtpEmailChannel implements NotificationChannel {
  readonly channel: NotificationChannelType = 'email';

  private readonly logger = new Logger(SmtpEmailChannel.name);

  async send(input: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const config = this.getConfig();
    const to = this.resolveEmailFromUserId(input.userId);

    if (process.env.EMAIL_CHANNEL_SHOULD_FAIL === 'true') {
      throw new Error('Simulated EmailChannel failure');
    }
    if (!config.enabled) {
      this.logger.log(
        `[EMAIL:DRY_RUN] to=${to} type=${input.type} subject="${input.title}" message="${input.message}" metadata=${JSON.stringify(
          input.metadata ?? {},
        )}`,
      );
      return;
    }

    await this.sendSmtpMail({
      host: config.host,
      port: config.port,
      secure: config.secure,
      username: config.username,
      password: config.password,
      from: config.from,
      to,
      subject: input.title,
      text: `${input.message}\n\nMetadata:\n${JSON.stringify(input.metadata ?? {}, null, 2)}`,
    });

    this.logger.log(
      `[EMAIL:SENT] to=${to} type=${input.type} subject="${input.title}"`,
    );
  }

  private getConfig():
    | { enabled: false }
    | {
        enabled: true;
        host: string;
        port: number;
        secure: boolean;
        username?: string;
        password?: string;
        from: string;
      } {
    const host = process.env.SMTP_HOST;
    const from = process.env.SMTP_FROM;

    if (!host || !from) {
      return { enabled: false };
    }

    return {
      enabled: true,
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      username: process.env.SMTP_USER,
      password: process.env.SMTP_PASS,
      from,
    };
  }

  private resolveEmailFromUserId(userId: string): string {
    return userId.includes('@') ? userId : `${userId}@taskflow.local`;
  }

  private async sendSmtpMail(input: {
    host: string;
    port: number;
    secure: boolean;
    username?: string;
    password?: string;
    from: string;
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    let socket: net.Socket | tls.TLSSocket = input.secure
      ? tls.connect(input.port, input.host, { servername: input.host })
      : net.connect(input.port, input.host);

    await once(socket, 'connect');
    await this.readResponse(socket);

    await this.command(socket, `EHLO taskflow.local`);

    if (!input.secure && process.env.SMTP_STARTTLS !== 'false') {
      try {
        await this.command(socket, 'STARTTLS');
        socket = tls.connect({ socket, servername: input.host });
        await once(socket, 'secureConnect');
        await this.command(socket, `EHLO taskflow.local`);
      } catch (error) {
        this.logger.warn(
          `SMTP STARTTLS unavailable, continuing without TLS: ${String(error)}`,
        );
      }
    }

    if (input.username && input.password) {
      await this.command(socket, 'AUTH LOGIN');
      await this.command(
        socket,
        Buffer.from(input.username).toString('base64'),
      );
      await this.command(
        socket,
        Buffer.from(input.password).toString('base64'),
      );
    }

    await this.command(socket, `MAIL FROM:<${input.from}>`);
    await this.command(socket, `RCPT TO:<${input.to}>`);
    await this.command(socket, 'DATA');

    const content = [
      `From: ${input.from}`,
      `To: ${input.to}`,
      `Subject: ${this.sanitizeHeader(input.subject)}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      '',
      input.text.replace(/\r?\n\./g, '\n..'),
      '.',
    ].join('\r\n');

    await this.command(socket, content);
    await this.command(socket, 'QUIT');
    socket.end();
  }

  private async command(
    socket: net.Socket | tls.TLSSocket,
    command: string,
  ): Promise<string> {
    socket.write(`${command}\r\n`);
    return this.readResponse(socket);
  }

  private async readResponse(
    socket: net.Socket | tls.TLSSocket,
  ): Promise<string> {
    const chunks: Buffer[] = [];

    while (true) {
      const [chunk] = (await once(socket, 'data')) as [Buffer];
      chunks.push(chunk);
      const response = Buffer.concat(chunks).toString('utf8');
      const lines = response.trimEnd().split(/\r?\n/);
      const lastLine = lines[lines.length - 1] ?? '';

      if (/^\d{3} /.test(lastLine)) {
        const code = Number(lastLine.slice(0, 3));
        if (code >= 400) {
          throw new Error(`SMTP error: ${response}`);
        }
        return response;
      }
    }
  }

  private sanitizeHeader(value: string): string {
    return value.replace(/[\r\n]+/g, ' ').trim();
  }
}
