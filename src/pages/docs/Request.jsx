import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const Request = () => {
  const [requestType, setRequestType] = useState('none');
  const [jsonData, setJsonData] = useState('{}');
  const [formData, setFormData] = useState([{ key: '', value: '' }]);

  const handleRequestTypeChange = (type) => setRequestType(type);

  const handleJsonInputChange = (e) => {
    const { value, selectionStart } = e.target;
    const lastChar = value[selectionStart - 1];
    const nextChar = value[selectionStart];

    if (lastChar === '{' && nextChar !== '}') {
      const newValue = `${value.slice(0, selectionStart)}}${value.slice(selectionStart)}`;
      setJsonData(newValue);

      setTimeout(() => {
        e.target.selectionStart = selectionStart;
        e.target.selectionEnd = selectionStart;
      }, 0);
    } else if (lastChar === '\n' && value[selectionStart - 2] === '{' && nextChar === '}') {
      const indentation = '  ';
      const newValue = `${value.slice(0, selectionStart)}${indentation}\n${indentation}${value.slice(selectionStart)}`;

      setJsonData(newValue);

      setTimeout(() => {
        e.target.selectionStart = selectionStart + indentation.length;
        e.target.selectionEnd = selectionStart + indentation.length;
      }, 0);
    } else {
      setJsonData(value);
    }
  };

  const handleAddFormData = () => setFormData([...formData, { key: '', value: '' }]);

  const handleFormDataChange = (index, field, value) => {
    setFormData(formData.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleRemoveFormData = (index) => {
    setFormData(formData.filter((_, i) => i !== index));
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonData);
      setJsonData(JSON.stringify(parsed, null, 2));
    } catch {
      alert('유효한 JSON 형식이 아닙니다.');
    }
  };

  const JsonInput = () => (
    <div className='mb-4'>
      <label className='block text-[16px] font-semibold mb-2'>JSON Data</label>
      <textarea
        className='border rounded w-full p-2 font-mono text-sm bg-gray-50'
        rows={10}
        placeholder='Enter JSON data here...'
        value={jsonData}
        onChange={handleJsonInputChange}
        style={{
          whiteSpace: 'pre',
          overflowWrap: 'break-word',
          lineHeight: '1.4',
          borderLeft: '4px solid #ccc',
          paddingLeft: '10px',
        }}
      />
      <button className='mt-2 bg-blue-500 text-white px-4 py-2 rounded' onClick={handleFormatJson}>
        JSON 정렬
      </button>
    </div>
  );

  const FormDataInput = () => (
    <div className='mb-4'>
      <label className='block text-[16px] font-semibold mb-2'>Form-Data</label>
      <div className='space-y-2'>
        {formData.map((field, index) => (
          <div key={index} className='flex space-x-2'>
            <input
              type='text'
              className='border rounded p-2 flex-1'
              placeholder='Key'
              value={field.key}
              onChange={(e) => handleFormDataChange(index, 'key', e.target.value)}
            />
            <input
              type='text'
              className='border rounded p-2 flex-1'
              placeholder='Value'
              value={field.value}
              onChange={(e) => handleFormDataChange(index, 'value', e.target.value)}
            />
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
  );

  return (
    <div className='mb-4'>
      <label className='block font-semibold mb-2 text-[18px]'>Request</label>
      <select
        value={requestType}
        onChange={(e) => handleRequestTypeChange(e.target.value)}
        className='border rounded px-2 py-1 mb-4 w-full'
      >
        <option value='none'>None</option>
        <option value='json'>JSON</option>
        <option value='form-data'>Form-Data</option>
      </select>

      {requestType === 'json' && <JsonInput />}
      {requestType === 'form-data' && <FormDataInput />}
    </div>
  );
};

export default Request;
