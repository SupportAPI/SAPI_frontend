import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const Request = () => {
  const [requestType, setRequestType] = useState('none');
  const [jsonData, setJsonData] = useState('{}');
  const [formData, setFormData] = useState([{ key: '', value: '' }]);

  const handleRequestTypeChange = (type) => {
    setRequestType(type);
  };

  const handleJsonInputChange = (e) => {
    const { value, selectionStart } = e.target;
    const lastChar = value[selectionStart - 1];
    const nextChar = value[selectionStart];

    // `{` 입력 시 `}` 추가하고 자동 개행 및 들여쓰기 설정
    if (lastChar === '{' && nextChar !== '}') {
      const newValue = value.slice(0, selectionStart) + '\n  \n}' + value.slice(selectionStart);
      setJsonData(newValue);

      // 커서를 중괄호 안쪽 새 줄로 이동
      setTimeout(() => {
        e.target.selectionStart = selectionStart + 3;
        e.target.selectionEnd = selectionStart + 3;
      }, 0);
    }
    // 자동 줄바꿈 및 들여쓰기 유지
    else if (lastChar === '\n') {
      const previousIndentation = (value.slice(0, selectionStart).match(/(  )*$/) || [''])[0];
      const indentation = previousIndentation + '  '; // 기본 들여쓰기 2칸

      const newValue = value.slice(0, selectionStart) + indentation + value.slice(selectionStart);
      setJsonData(newValue);

      // 커서를 들여쓴 위치로 이동
      setTimeout(() => {
        e.target.selectionStart = selectionStart + indentation.length;
        e.target.selectionEnd = selectionStart + indentation.length;
      }, 0);
    } else {
      setJsonData(value);
    }
  };

  const handleAddFormData = () => {
    setFormData([...formData, { key: '', value: '' }]);
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
      const parsed = JSON.parse(jsonData);
      setJsonData(JSON.stringify(parsed, null, 2)); // JSON 정렬 시 기본 들여쓰기 2칸 적용
    } catch (error) {
      alert('유효한 JSON 형식이 아닙니다.');
    }
  };

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

      {/* JSON 입력 (JSON 선택 시만 표시) */}
      {requestType === 'json' && (
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
      )}

      {/* Form-Data 입력 (Form-Data 선택 시만 표시) */}
      {requestType === 'form-data' && (
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
      )}
    </div>
  );
};

export default Request;
