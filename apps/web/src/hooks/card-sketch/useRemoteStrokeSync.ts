import { useEffect, useRef } from "react";
import * as Y from "yjs";
import Stroke from "@/models/stroke";

interface UseRemoteStrokeSyncProps {
  remoteYArray: Y.Array<any>;
  originalStrokesRef: React.MutableRefObject<Stroke[]>;
  refresh: () => void;
}
function useRemoteStrokeSync({
  remoteYArray,
  originalStrokesRef,
  refresh,
}: UseRemoteStrokeSyncProps) {
  const remoteRenderStrokesRef = useRef<Stroke[]>([]);

  useEffect(() => {
    function handleSync() {
      const remoteStrokes = remoteYArray.toJSON();
      remoteRenderStrokesRef.current = remoteStrokes.filter(
        (stroke: any) =>
          !originalStrokesRef.current.some(
            (originalStroke: any) => originalStroke.id === stroke.id
          )
      );
      refresh();
    }
    remoteYArray.observeDeep(handleSync);

    setTimeout(() => {
      handleSync();
    }, 100);

    return () => remoteYArray.unobserveDeep(handleSync);
  }, [remoteYArray]);

  return remoteRenderStrokesRef;
}

export default useRemoteStrokeSync;
