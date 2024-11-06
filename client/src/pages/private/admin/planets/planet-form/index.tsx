import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageTitle from "../../../../../components/page-title";
import { Button, Form, Input, message, Select, Upload } from "antd";
import { uploadImagesToFirebaseAndReturnUrls } from "../../../../../helpers/uploads";
import axios from "axios";

function PlanetForm() {
  const params = useParams();
  const [selectedImagesFiles, setSelectedImagesFiles] = useState<any>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [planetData, setPlanetData] = useState<any | null>(null);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]); 

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const newImages = await uploadImagesToFirebaseAndReturnUrls(selectedImagesFiles);
      values.images = [...(uploadedImages || []), ...newImages];
      if(params.id) {
        await axios.put(`/api/planets/update/${params.id}`, values);
        message.success("Celestial body updated successfully");
      } else {
        await axios.post("/api/planets/create", values);
        message.success("Celestial body created successfully");
      }
      navigate(-1);
    } catch (error) {
      message.error(params.id ? "Failed to update celestial body" : "Failed to create celestial body");
    } finally {
      setLoading(false);
    }
  };

  const getPlanetData = async () => {
    try {
      const response = await axios.get(`/api/planets/get/${params.id}`);
      setPlanetData(response.data.planet);
      setUploadedImages(response.data.planet.images);
    } catch (error: any) {
      message.error("Failed to fetch celestial body data");
    }
  };

  useEffect(() => {
    if (params.id) {
      getPlanetData();
    } else {
      setUploadedImages([]);
    }
  }, []);

  let showForm = false;

  if(!params.id) {
    showForm = true;
  }

  if(params.id && planetData) {
    showForm = true;
  }

  return (
    <div>
      <PageTitle title={params.id ? "Edit Celestial Body" : "Register New Celestial Body"} />
      {showForm && (
        <Form
          form={form}
          layout="vertical"
          className="mt-7 flex flex-col gap-5"
          onFinish={onFinish}
          initialValues={planetData}
        >
          <Form.Item label="Celestial Body Name" name="name" required>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Astronomical Description" required>
            <Input.TextArea />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Form.Item name="organizer" label="Space Agency" required>
              <Input />
            </Form.Item>
            <Form.Item name="targetAmount" label="Land Value (₹)" required>
              <Input type="number" min={5000}/>
            </Form.Item>
            <Form.Item name="category" label="Classification" required>
              <Select>
                <Select.Option value="Terrestrial">Terrestrial Planet</Select.Option>
                <Select.Option value="GasGiant">Gas Giant</Select.Option>
                <Select.Option value="DwarfPlanet">Dwarf Planet</Select.Option>
                <Select.Option value="Moon">Natural Satellite</Select.Option>
                <Select.Option value="Asteroid">Asteroid</Select.Option>
                <Select.Option value="Comet">Comet</Select.Option>
                <Select.Option value="Other">Other Celestial Body</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="startDate" label="Mission Start Date" required>
              <Input type="date" onChange={(e) => {
                form.setFieldsValue({
                  endDate: e.target.value 
                });
              }} />
            </Form.Item>
            <Form.Item name="endDate" label="Mission End Date" required rules={[
              {
                validator: async (_, value) => {
                  const startDate = form.getFieldValue('startDate');
                  if (startDate && value && value < startDate) {
                    throw new Error('Mission end date must be after start date');
                  }
                }
              }
            ]}>
              <Input type="date" min={form.getFieldValue('startDate')} />
            </Form.Item>
            <Form.Item name="isActive" label="Available for Purchase" required>
              <Select>
                <Select.Option value={true}>Yes</Select.Option>
                <Select.Option value={false}>No</Select.Option>
              </Select>
            </Form.Item>
            <div className="flex gap-5">
              {uploadedImages && uploadedImages.map((image:any, index:number)=>(
                <div key={index} className="flex flex-col gap-2 border rounded items-center justify-center">
                  <img src={image} alt="uploaded" className="w-20 h-20 rounded" />
                  <span className="text-sm cursor-pointer underline" onClick={()=>setUploadedImages((prev:any)=>prev.filter((i:any)=>i!==image))}>Click to remove</span>
                </div>
              ))}
              <Form.Item name="images" label="Astronomical Images">
                <Upload
                  listType="picture-card"
                  beforeUpload={(file: File) => {
                    setSelectedImagesFiles((prev: any) => [...prev, file]);
                    return false;
                  }}
                  fileList={selectedImagesFiles.map((file: any) => ({
                    ...file,
                    url: URL.createObjectURL(file),
                  }))}
                  onRemove={(file: any) => {
                    setSelectedImagesFiles((prev: any) =>
                      prev.filter((f: any) => f.uid !== file.uid)
                    );
                  }}
                >
                  <span className="text-sm">Upload Images</span>
                </Upload>
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-end gap-5">
            <Button disabled={loading} onClick={() => navigate(-1)}>Abort Mission</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {params.id ? "Update Records" : "Launch Mission"}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}

export default PlanetForm;