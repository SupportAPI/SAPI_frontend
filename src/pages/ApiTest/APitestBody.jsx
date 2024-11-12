import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { toast } from 'react-toastify';
import { useEnvironmentStore } from '../../stores/useEnvironmentStore';

const ApiTestParameters = ({ body, bodyChange }) => {
  const [bodyType, setBodyType] = useState(body.bodyType);
  const [json, setJson] = useState(body.json || { id: '', value: '{}' });
  const [formData, setFormData] = useState(body.formData || []);
  const { environment } = useEnvironmentStore();
  const [envDropdown, setEnvDropdown] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    bodyChange({
      bodyType,
      json,
      formData,
    });
  }, [bodyType, json, formData]);

  const handleFormDataChange = () => {
    try {
      const parsed = JSON.parse(json.value || '{}');
      setJson({
        id: json.id,
        value: JSON.stringify(parsed, null, 2),
      });
      toast('JSON 정렬이 완료되었습니다.');
    } catch (e) {
      toast('유효한 JSON 형식이 아닙니다.');
    }
  };

  useEffect(() => {
    setBodyType('JSON');
    try {
      const parsed = JSON.parse(json.value || '{}');
      setJson({
        id: json.id,
        value: JSON.stringify(parsed, null, 2),
      });
    } catch (e) {
      toast('유효한 JSON 형식이 아닙니다.');
    }
  }, []);

  const handleJsonEditorChange = (value) => {
    setJson({ ...json, value });

    const nearestStartIndex = value.lastIndexOf('{{');
    if (nearestStartIndex !== -1) {
      const afterStart = value.slice(nearestStartIndex + 2);
      const firstSpaceIndex = afterStart.search(/\s|}}/);
      const searchValue = firstSpaceIndex === -1 ? afterStart : afterStart.slice(0, firstSpaceIndex);

      setEnvDropdown(environment?.filter((env) => env.value.startsWith(searchValue)));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const cursorPosition = e.target.selectionStart;
    const updatedFormData = [...formData];
    updatedFormData[index].value = value;
    setFormData(updatedFormData);

    // Detect nearest `{{` and update envDropdown
    const nearestStartIndex = value.lastIndexOf('{{', cursorPosition - 1);
    if (nearestStartIndex !== -1) {
      const afterStart = value.slice(nearestStartIndex + 2);
      const firstSpaceIndex = afterStart.search(/\s|}}/);
      const searchValue = firstSpaceIndex === -1 ? afterStart : afterStart.slice(0, firstSpaceIndex);

      setEnvDropdown(environment?.filter((env) => env.value.startsWith(searchValue)));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleEnvironmentSelect = (selectedVariable, index) => {
    const updatedFormData = [...formData];
    const originalValue = updatedFormData[index].value;

    const nearestStartIndex = originalValue.lastIndexOf('{{');
    if (nearestStartIndex !== -1) {
      const afterStart = originalValue.slice(nearestStartIndex + 2);
      const firstSpaceIndex = afterStart.search(/\s|}}/);
      const endIndex = firstSpaceIndex === -1 ? originalValue.length : nearestStartIndex + 2 + firstSpaceIndex;

      const newValue =
        originalValue.slice(0, nearestStartIndex) + `{{${selectedVariable}}}` + originalValue.slice(endIndex);

      updatedFormData[index].value = newValue;
      setFormData(updatedFormData);
    }

    setShowDropdown(false);
  };

  const handleEnvironmentSelectInJson = (selectedVariable) => {
    const originalValue = json.value;
    const nearestStartIndex = originalValue.lastIndexOf('{{');

    if (nearestStartIndex !== -1) {
      const afterStart = originalValue.slice(nearestStartIndex + 2);
      const firstSpaceIndex = afterStart.search(/\s|}}/);
      const endIndex = firstSpaceIndex === -1 ? originalValue.length : nearestStartIndex + 2 + firstSpaceIndex;

      const newValue =
        originalValue.slice(0, nearestStartIndex) + `{{${selectedVariable}}}` + originalValue.slice(endIndex);

      setJson({ ...json, value: newValue });
      setShowDropdown(false);
    }
  };

  const renderFormDataTable = () => (
    <div className='mb-4'>
      <h3 className='font-bold text-sm mb-2'>Form Data</h3>
      <table className='w-full border border-gray-300'>
        <thead>
          <tr>
            <th className='py-2 px-4 text-sm border bg-gray-100'>Parameter Name</th>
            <th className='py-2 px-4 text-sm border bg-gray-100'>Value</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((item, index) => (
            <tr key={index} className='hover:bg-gray-50'>
              <td className='py-2 px-4 text-sm border text-center'>{item.key}</td>
              <td className='py-2 px-4 border text-center relative'>
                <input
                  type='text'
                  value={item.value}
                  onChange={(e) => handleInputChange(e, index)}
                  className='w-full text-sm border p-1 text-center'
                />
                {showDropdown && (
                  <div className='absolute left-0 right-0 bg-white border border-gray-300 mt-1 z-10'>
                    {envDropdown.map((env, i) => (
                      <div
                        key={i}
                        onClick={() => handleEnvironmentSelect(env.variable, index)}
                        className='p-2 text-sm hover:bg-gray-100 cursor-pointer'
                      >
                        {env.variable}
                      </div>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!json) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {bodyType === 'NONE' && <p className='mt-5 text-center text-gray-500'>No Body</p>}

      {bodyType === 'JSON' && (
        <div className='mb-4'>
          <div className='flex justify-between items-center mb-4'>
            <div className='font-bold text-sm'>JSON Body</div>
            <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={handleFormDataChange}>
              JSON 정렬
            </button>
          </div>

          <Editor
            height='200px'
            language='json'
            value={json.value || '{}'}
            onChange={handleJsonEditorChange}
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
          {showDropdown && (
            <div className='absolute left-0 right-0 bg-white border border-gray-300 mt-1 z-10'>
              {envDropdown.map((env, i) => (
                <div
                  key={i}
                  onClick={() => handleEnvironmentSelectInJson(env.variable)}
                  className='p-2 text-sm hover:bg-gray-100 cursor-pointer'
                >
                  {env.variable}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {bodyType === 'FORM_DATA' && formData.length > 0 && renderFormDataTable()}
    </div>
  );
};

export default ApiTestParameters;
