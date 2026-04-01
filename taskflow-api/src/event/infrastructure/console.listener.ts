import {OnEvent} from "@nestjs/event-emitter";
import {Injectable, Logger} from "@nestjs/common";

@Injectable()
export class ConsoleListener {
    private readonly logger = new Logger(ConsoleListener.name);

    @OnEvent('**')
    handleEverything(payload: any): void {
        this.logger.log(`New event: ${payload}`);
    }
}

