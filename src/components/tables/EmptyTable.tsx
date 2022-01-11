import { ReactComponent as EmptyTable } from '../../resources/svg/emptyTable.svg';
import { ReactComponent as EmptyDashboard } from '../../resources/svg/emptyDashboard.svg';

export const TableEmpty = (props: { category: string }) => {
  return (
    <div className="w-100p h-100p flex flex-col items-center justify-center">
      <EmptyTable />
      <div className="empty-text mt-21">
        해당 회사의 {props.category} 정보를 찾을 수 없습니다. <br />
        {/*<span>+ 를 눌러</span> 파트나 도면을 추가하세요.*/}
      </div>
    </div>
  );
};

export const DashboardEmpty = () => {
  return (
    <div className="w-100p h-100p flex flex-col items-center justify-center">
      <EmptyDashboard />
      <div className="empty-text mt-34">미결된 도면이 없습니다.</div>
    </div>
  );
};
