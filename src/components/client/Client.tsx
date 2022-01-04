import { Route, useParams } from 'react-router-dom';

import PartTable from '../tables/PartTable';
import DrawingTable from '../tables/DrawingTable';

const Client = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div
      id="client-container"
      className="flex overflow-hidden w-100p h-100p justify-center"
    >
      <div id="client-content">
        <Route path="/client/:id/part">
          <PartTable clientId={Number(id)} />
        </Route>
        <Route path="/client/:id/drawing">
          <DrawingTable clientId={Number(id)} type="client" />
        </Route>
      </div>
    </div>
  );
};

export default Client;
