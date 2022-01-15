import { AxiosResponse } from 'axios';
import { DrawingData, OutsourceData, PartData } from '../types';
import validatePost from './validatePost';
import webClient from './Webclient';

const createDrawing = async (drawing: DrawingData) => {
  const createdDrawing: AxiosResponse = await webClient.post(
    'drawing/',
    drawing
  );

  return createdDrawing.data.id;
};

const uploadImage = async (file: Blob) => {
  const formData = new FormData();
  formData.append('file', file);
  const createdFile: AxiosResponse = await webClient.post('files/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return createdFile.data.id;
};

const createOutsource = async (osPart: OutsourceData) => {
  const createdOsPart: AxiosResponse = await webClient.post(
    'outsource/',
    osPart
  );
  return createdOsPart.data.id;
};

const createPart = async (part: PartData) => {
  await webClient.post('part/', {
    x: part.x,
    y: part.y,
    z: part.z,
    quantity: part.quantity,
    price: part.price,
    comment: part.comment,
    drawing: part.drawing,
    division: part.division,
    material: part.material,
    outsource: part.outsource,
    file: part.file,
  });
};

const post = async (
  drawing: DrawingData,
  parts: PartData[],
  osParts: OutsourceData[]
) => {
  try {
    if (!validatePost(drawing, parts)) return;

    // Step 1. Create Drawing
    const drawingId = await createDrawing(drawing);

    for (let i = 0; i < parts.length; i++) {
      const part = { ...parts[i] };
      part.drawing = drawingId;

      // Step 2. Upload Image if necessary
      if (part.fileData) part.file = await uploadImage(part.fileData);

      // Step 3. Create Outsource if necessary
      if (drawing.is_outsource)
        part.outsource = await createOutsource(osParts[i]);

      // Step 4. Create Part
      createPart(part);
    }

    alert('도면을 성공적으로 추가하였습니다.');
    window.location.replace('/');
  } catch (error) {
    console.log(error);
  }
};

export default post;
