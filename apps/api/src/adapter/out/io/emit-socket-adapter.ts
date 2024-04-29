import type { BroadcastOperator, Server } from "socket.io";
import type { DecorateAcknowledgementsWithMultipleResponses, DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import type { EmitSocketPort } from "@/application/port/out/emit-socket-port";

function CreateSocketEmitAdapter(
    io: Server
): EmitSocketPort {
    return function (props) {
        let pipeIo: BroadcastOperator<DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>, any> | null = null;
        if (props.room) {
            pipeIo = io.to(props.room);
        }
        if (props.except) {
            pipeIo = (pipeIo || io).except(props.except);
        }
        (pipeIo || io).emit(props.event, props.data);
    };
}
export default CreateSocketEmitAdapter;