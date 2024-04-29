export type EmitSocketPort = (props: {
  event: string;
  data: any;
  room?: string;
  except?: string;
}) => void;
