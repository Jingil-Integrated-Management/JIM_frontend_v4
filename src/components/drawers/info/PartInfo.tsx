import { PartData, OutsourceData } from '../../../types';
import { ReactComponent as ImageEmpty } from '../../../resources/svg/imageEmpty.svg';
import formatPrice from '../../../utils/formatPrice';

interface PartInfoProps {
  part: PartData;
  index: number;
}

interface OutsourcePartInfoProps {
  outsource_info: OutsourceData;
}

const PartInfo = (props: PartInfoProps) => {
  const { index, part } = props;

  return (
    <div>
      <div className="flex flex-row mt-36">
        <div className="flex justify-center items-center w-40 h-40 bg-palette-purple-index rounded-panel">
          {index + 1}
        </div>
        <div className="flex justify-center items-center w-95 h-40 ml-10 rounded-panel bg-palette-grey">
          파트 정보
        </div>
      </div>
      <div className="flex justify-center items-center">
        {!part.file_name ? (
          <div className="w-544 h-306 mt-32 flex justify-center items-center rounded-8 imageBox">
            <ImageEmpty />
          </div>
        ) : (
          <img
            className="w-544 h-306 mt-32 rounded-8"
            src={`https://storage.googleapis.com/jim-storage/${part.file_name}`}
            alt="part_image"
          />
        )}
      </div>
      <div className="mt-24 h-72 flex">
        <div className="w-256">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            메인 구분
          </div>
          <div className="client w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {part.division__main_division}
          </div>
        </div>
        <div className="w-256 ml-32">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            세부 구분
          </div>
          <div className="client w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {part.division__sub_division === null
              ? ''
              : part.division__sub_division}
          </div>
        </div>
      </div>
      <div className="mt-12 flex">
        <div className="w-160">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트크기- X
          </div>
          <div className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {part.x}
          </div>
        </div>
        <div className="ml-32 w-160">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트크기- Y
          </div>
          <div className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {part.y}
          </div>
        </div>
        <div className="ml-32 w-160">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트크기- Z
          </div>
          <div className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {part.z}
          </div>
        </div>
      </div>
      <div className="mt-12 flex flex-row">
        <div className="w-256">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            소재
          </div>
          <div className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {part.material}
          </div>
        </div>
        <div className="w-256 ml-32">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트 개수
          </div>
          <div className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {part.quantity}
          </div>
        </div>
      </div>
      <div className="mt-12 flex flex-row">
        <div className="w-256">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            가격
          </div>
          <div className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {formatPrice(part.price)}
          </div>
        </div>
        <div className="w-256 ml-32">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            비고
          </div>
          <div className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {part.comment}
          </div>
        </div>
      </div>
      {part.drawing__is_outsource && part.outsource_info ? (
        <OutsourcePartInfo outsource_info={part.outsource_info} />
      ) : (
        <></>
      )}
    </div>
  );
};

const OutsourcePartInfo = (props: OutsourcePartInfoProps) => {
  const info = props.outsource_info;

  const getMaterial = () => {
    if (!info.material_client) return null;

    return {
      subject: '소재',
      client: info.material_client__name,
      price: info.material_price,
    };
  };

  const getMilling = () => {
    if (!info.milling_client) return null;

    return {
      subject: '밀링',
      client: info.milling_client__name,
      price: info.milling_price,
    };
  };

  const getHeatTreat = () => {
    if (!info.heat_treat_client) return null;

    return {
      subject: '열처리',
      client: info.heat_treat_client__name,
      price: info.heat_treat_price,
    };
  };

  const getWire = () => {
    if (!info.wire_client) return null;

    return {
      subject: '와이어',
      client: info.wire_client__name,
      price: info.wire_price,
    };
  };

  const outsources = [getMaterial(), getMilling(), getHeatTreat(), getWire()];

  return (
    <>
      {outsources.map((outsource, index) => {
        if (outsource) {
          return (
            <div key={index.toString()} className="mt-12 flex flex-row">
              <div className="w-256">
                <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
                  {outsource.subject} 업체
                </div>
                <div className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
                  {outsource.client}
                </div>
              </div>
              <div className="w-256 ml-32">
                <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
                  가격
                </div>
                <div className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
                  {outsource.price}
                </div>
              </div>
            </div>
          );
        }
        return <div key={index.toString()} />;
      })}
    </>
  );
};

export default PartInfo;
