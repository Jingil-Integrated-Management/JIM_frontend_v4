import formatPrice from '../../utils/formatPrice';

interface StatsProps {
  title: string;
  is_positive: boolean;
  gross: number | string;
  value: string | undefined | null;
}

const MonthStats = (props: StatsProps) => {
  return (
    <div className="statistics-month-stats text-palette-black bg-palette-light-theme px-16 py-12 w-288 h-96 mr-30 flex flex-col justify-between">
      <div className="statistics-month-stat-title flex">{props.title}</div>
      <div
        className={
          'statistics-month-stat-info flex justify-end ' +
          (props.is_positive === true ||
          props.title !== '총 매출' ||
          props.gross === 0 ||
          props.gross === '0'
            ? 'text-palette-purple-on'
            : 'text-palette-word-2')
        }
      >
        전 월 대비
        {props.gross === 0 || props.gross === '0'
          ? ' '
          : props.title === '총 매출'
          ? props.is_positive === true
            ? ' +'
            : ' -'
          : ' '}
        {props.gross}%
      </div>
      <div className="statistics-month-stat-value flex justify-end">
        {formatPrice(props.value)}
        <div className="flex ml-3 statistics-stat-currency flex-col-reverse pb-4">
          원
        </div>
      </div>
    </div>
  );
};

export default MonthStats;
