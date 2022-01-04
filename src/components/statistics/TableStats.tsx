import formatPrice from '../../utils/formatPrice';

interface StatsProps {
  title: string;
  is_positive: boolean;
  gross: string;
  value: string | undefined | null;
}

const TableStats = (props: StatsProps) => {
  return (
    <div className="statistics-table-stats flex text-palette-black bg-palette-light-theme justify-between mt-18 mb-12 mr-16 px-16 py-6 h-48">
      <div className="flex flex-col justify-center">
        <div className="statistics-stat-table-title flex">{props.title}</div>
        <div className="statistics-stat-table-info flex text-palette-purple-on">
          {props.title === '연마 매출 합계' || props.title === '제작 매출 합계'
            ? '전체 매출의 '
            : props.title === '외주비 합계' || props.title === '제작 순이익'
            ? '제작 매출의 '
            : '외주비의 '}
          {props.gross}%
        </div>
      </div>
      <div className="statistics-stat-table-value flex flex-col justify-center">
        <div className="flex">
          {formatPrice(props.value)}
          <div className="flex ml-3 statistics-stat-currency flex-col-reverse pb-4">
            원
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableStats;
