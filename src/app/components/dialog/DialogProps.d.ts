import { DefaultParams } from 'src/app/utils/defaultParams';

export default interface IDialogProps extends DefaultParams {
  visible: boolean;
  title: string;
  acceptText: string;
  rejectText: string;
  onAccept: () => any;
  onReject: () => any;
  children: React.ReactNode;
}
