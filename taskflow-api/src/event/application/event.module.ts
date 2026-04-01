import {Module} from "@nestjs/common";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {EVENT_PUBLISHER} from "./event.constants";
import {NestEventPublisher} from "../infrastructure/nest.event-publisher";
import {ConsoleListener} from "../infrastructure/console.listener";

@Module({
    imports: [
        EventEmitterModule.forRoot({wildcard: true})
    ],
    providers: [
        {
            provide: EVENT_PUBLISHER,
            useClass: NestEventPublisher
        },
        ConsoleListener
    ],
    exports: [
        EVENT_PUBLISHER,
    ]
})
export class EventModule {
}