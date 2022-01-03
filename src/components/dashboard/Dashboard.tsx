import { useEffect } from 'react';
import { connect } from 'react-redux';
import { changeClientList } from '../../redux/action/clientAction';

interface Client {
  id: number;
  name: string;
  is_pinned: number;
}

const Dashboard = (props: any) => {
  useEffect(() => {
    console.log('client data => ', props.clientList);
  }, [props.clientList]);

  const changeClientList = () => {
    props.dispatchChangeClientList([
      { id: 1, name: '블라블라', is_pinned: 0 },
      { id: 2, name: '블라블라', is_pinned: 0 },
    ]);
  };

  return (
    <div
      id="dashboard-container"
      className="flex h-100p w-100p overflow-hidden justify-center"
    >
      Dashboard
      <div
        onClick={() => changeClientList()}
        style={{
          backgroundColor: 'gray',
          width: '100px',
          height: '100px',
          cursor: 'pointer',
        }}
      >
        client list 변경
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  dispatchChangeClientList: (clientList: Client[]) =>
    changeClientList(clientList),
};

const mapStateToProps = (state: any) => ({
  clientList: state.clientReducer.clientList,
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
