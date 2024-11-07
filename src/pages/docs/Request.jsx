import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Editor from '@monaco-editor/react';

const Request = ({ requestChange = () => {}, initialValues }) => {
  const [bodyType, setRequestType] = useState(initialValues?.bodyType || 'none');
  const [json, setJsonData] = useState(initialValues?.json?.jsonDataValue || '{}');
  const [formData, setFormData] = useState(initialValues?.formData || []);

  const handleRequestTypeChange = (type) => {
    setRequestType(type);
  };

  useEffect(() => {
    requestChange({
      bodyType: bodyType,
      json: {
        jsonDataId: initialValues?.json?.jsonDataId || '',
        jsonDataKey: initialValues?.json?.jsonDataKey || 'json',
        jsonDataValue: json,
        jsonDataType: initialValues?.json?.jsonDataType || 'JSON',
        jsonDataDescription: initialValues?.json?.jsonDataDescription || null,
      },
      formData: formData.map((data) => ({
        formDataId: data.formDataId || '',
        formDataKey: data.formDataKey || '',
        formDataValue: data.formDataValue || '',
        formDataType: data.formDataType || 'TEXT',
        formDataDescription: data.formDataDescription || null,
      })),
    });
  }, [bodyType, json, formData]);

  const handleAddFormData = () => {
    setFormData([
      ...formData,
      { formDataId: '', formDataKey: '', formDataValue: '', formDataType: 'TEXT', formDataDescription: '' },
    ]);
  };

  const handleFormDataChange = (index, field, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index][field] = value;
    setFormData(updatedFormData);
  };

  const handleRemoveFormData = (index) => {
    setFormData(formData.filter((_, i) => i !== index));
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(json);
      setJsonData(JSON.stringify(parsed, null, 2));
    } catch (error) {
      alert('유효한 JSON 형식이 아닙니다.');
    }
  };

  return (
    <div className='pt-4'>
      <label className='block text-[18px] font-semibold h-8'>Request</label>
      <select
        value={bodyType}
        onChange={(e) => handleRequestTypeChange(e.target.value)}
        className='border rounded px-2 py-1 w-full h-10'
      >
        <option value='NONE'>None</option>
        <option value='JSON'>JSON</option>
        <option value='FORM-DATA'>Form-Data</option>
      </select>

      {/* JSON 입력 (JSON 선택 시만 표시) */}
      {bodyType === 'JSON' && (
        <div className='mb-4'>
          <label className='block text-[16px] font-semibold mb-2'>JSON Data</label>
          <Editor
            height='200px'
            language='json'
            value={json}
            onChange={(value) => setJsonData(value || '{}')}
            options={{
              automaticLayout: true,
              autoClosingBrackets: 'always',
              formatOnType: true,
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              minimap: {
                enabled: false,
                renderCharacters: false,
                showSlider: 'mouseover',
                decorations: false,
              },
            }}
          />
          <button className='mt-2 bg-blue-500 text-white px-4 py-2 rounded' onClick={handleFormatJson}>
            JSON 정렬
          </button>
        </div>
      )}

      {/* Form-Data 입력 (Form-Data 선택 시만 표시) */}
      {bodyType === 'FORM-DATA' && (
        <div className='mb-4'>
          <label className='block text-[16px] font-semibold mb-2'>Form-Data</label>
          <div className='space-y-2'>
            {formData.map((field, index) => (
              <div key={index} className='flex space-x-2'>
                <input
                  type='text'
                  className='border rounded p-2 flex-1'
                  placeholder='Key'
                  value={field.formDataKey}
                  onChange={(e) => handleFormDataChange(index, 'formDataKey', e.target.value)}
                />
                <input
                  type='text'
                  className='border rounded p-2 flex-1'
                  placeholder='Value'
                  value={field.formDataValue}
                  onChange={(e) => handleFormDataChange(index, 'formDataValue', e.target.value)}
                />
                <select
                  className='border rounded p-2 flex-1'
                  value={field.formDataType}
                  onChange={(e) => handleFormDataChange(index, 'formDataType', e.target.value)}
                >
                  <option value='TEXT'>Text</option>
                  <option value='FILE'>File</option>
                </select>
                <button onClick={() => handleRemoveFormData(index)} className='text-red-500 font-bold'>
                  🗑️
                </button>
              </div>
            ))}
            <button className='mt-2 flex items-center text-blue-600 hover:text-blue-800' onClick={handleAddFormData}>
              <FaPlus />
              <span className='ml-1'>Add</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
