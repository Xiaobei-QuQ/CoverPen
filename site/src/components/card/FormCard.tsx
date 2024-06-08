"use client";
import useFormStore, { FormValue } from "@/hooks/useFormStore";
import { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Slider, Space, Upload, List, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import WallpaperList from "@/components/card/WallpaperList";
import ThemeList from "@/components/card/ThemeList";
import SliderInput from "@/components/SliderInput";
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const SpaceCompact = Space;

const devIconsUrl = "https://raw.githubusercontent.com/devicons/devicon/master/devicon.json";

const fontOptions = [
  { label: "Serif", value: "font-serif" },
  { label: "Sans", value: "font-sans" },
  { label: "Mono", value: "font-mono" },
  { label: "Inter", value: "font-Inter" },
  { label: "Poppins", value: "font-Poppins" },
  { label: "Anek", value: "font-Anek" },
];

const aspectRatio = [
  { label: "16:9", desc: "16:9", value: "16/9" },
  { label: "9:16", desc: "9:16", value: "9/16" },
  { label: "1:1", desc: "1:1", value: "1/1" },
  { label: "2:1", desc: "2:1", value: "2/1" },
  { label: "4:5", desc: "4:5", value: "4/5" },
  { label: "2.35:1", desc: "微信公众号—图文封面", value: "2.35/1" },
];

export default function FormCard() {
  const [iconOptions, setIconOptions] = useState([]);
  useEffect(() => {
    fetch(devIconsUrl)
      .then((r) => r.json())
      .then((data) => {
        data.push({ name: "custom" });
        setIconOptions(data.map((item: any) => ({ label: item.name, value: item.name })));
      });
  }, []);
  const setState = useFormStore.setState;
  const formValue = useFormStore();
  const form = Form.useFormInstance();

  useEffect(() => {
    form?.setFieldsValue(formValue);
  }, [formValue]);

  const onChange = (changedValues: any, allValues: FormValue) => {
    console.log("onchange", changedValues, allValues);
    if (changedValues.customIcon?.file.status === "done") {
      //文件上传
      setState((state) => {
        return {
          ...state,
          icon: "",
          customIcon: URL.createObjectURL(changedValues.customIcon.file.originFileObj),
        };
      });
    } else {
      setState((state) => {
        return {
          ...state,
          ...allValues,
          customIcon: changedValues.icon ? "" : state.customIcon,
        };
      });
    }
  };

  const Label = ({ children }: any) => <span className="text-lg text-gray-500">{children}</span>;

  return (
    <Form layout="vertical" initialValues={formValue} onValuesChange={onChange} className="p-5 pb-16">
      <FormItem label={<Label>主题</Label>} name="theme">
        <ThemeList />
      </FormItem>

      <FormItem label={<Label>比例</Label>} name="aspectRatio">
        <Select
          options={aspectRatio}
          optionRender={(option) => (
            <div className="flex gap-1 items-center">
              <div className="flex flex-col leading-7">
                <span className="font-bold">{option.data.desc}</span>
                <span>{option.data.label}</span>
              </div>
            </div>
          )}
        />
      </FormItem>

      <FormItem label={<Label>标题</Label>} name="title">
        {/*<Input name="title" placeholder="请输入标题" />*/}
        <TextArea rows={1} placeholder="请输入标题" autoSize />
      </FormItem>

      <FormItem label={<Label>作者</Label>} name="author">
        <Input name="author" placeholder="请填写作者" />
      </FormItem>
      <Form.Item label={<Label>图标</Label>}>
        <Row gutter={24}>
          <Col span={16}>
            <FormItem noStyle label={<Label>图标</Label>} name="icon">
              <Select
                showSearch
                options={iconOptions}
                optionRender={(option) => (
                  <div className="flex">
                    <span className="mr-2">{option.data.value}</span>
                    <div className="ml-auto mr-2">
                      <i className={`devicon-${option.data.value}-plain dev-icon text-2xl`}></i>
                    </div>
                  </div>
                )}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem noStyle name="customIcon">
              <Upload showUploadList={false}>
                <Button icon={<UploadOutlined />}>自定义</Button>
              </Upload>
            </FormItem>
            {/*<Button>Get captcha</Button>*/}
          </Col>
        </Row>
      </Form.Item>

      <FormItem label={<Label>背景</Label>} name="background">
        <WallpaperList />
      </FormItem>

      {!["preview", "outline", "mobile"].includes(formValue.theme) && (
        <FormItem label={<Label>圆角</Label>} name="borderRadius">
          <SliderInput step={1} max={100} min={0} />
        </FormItem>
      )}

      <FormItem label={<Label>宽度</Label>} name="width">
        <SliderInput step={1} max={1000} min={400} />
      </FormItem>
      <FormItem label={<Label>字体</Label>} name="font">
        <Select showSearch options={fontOptions} placeholder="请选择字体" />
      </FormItem>
    </Form>
  );
}