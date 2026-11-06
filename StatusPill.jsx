import { STAGE_LABEL } from '../data/menu';

export default function StatusPill({ status }) {
  const cls = status === 'DELIVERED' ? 's-delivered' : status === 'CANCELLED' ? 's-cancelled' : '';
  return <span className={'status ' + cls}>{STAGE_LABEL[status] || status}</span>;
}
