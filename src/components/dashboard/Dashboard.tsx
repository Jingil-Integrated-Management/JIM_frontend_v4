import DrawingTable from '../tables/DrawingTable';
import PartTable from '../tables/PartTable';

const Dashboard = () => {
  return (
    <div
      id="dashboard-container"
      className="flex h-100p w-100p overflow-hidden justify-center"
    >
      <div
        id="dashboard-content"
        className="flex flex-col items-center justify-start h-100p w-100p overflow-scroll scroll-hide"
      >
        <div className="flex w-100p mb-18">
          <PartTable clientId={324} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
