import { Editor } from '@monaco-editor/react';

const HistoryRequest = ({ initialValues = {} }) => {
  const { bodyType = 'None', formData = [], json = [] } = initialValues;

  const handleEditorDidMount = (editor, monaco) => {
    editor.updateOptions({ readOnly: true }); // 읽기 전용 설정

    editor.onKeyDown((e) => {
      e.preventDefault(); // 모든 키 입력 차단
    });
  };

  return (
    <div>
      <div className='mb-4'>
        <label className='flex items-center text-[16px] font-semibold h-8'>Body Type</label>
        <div className='w-[250px] text-[14px] rounded-sm flex items-center text-center px-3 py-2 relative h-10 border'>
          {bodyType}
        </div>
        {bodyType === 'None' ? (
          <></>
        ) : bodyType === 'JSON' ? (
          <div>
            <label className='flex items-center text-[16px] font-semibold h-8 mt-4'>JSON Data</label>
            <Editor
              height='200px'
              language='json'
              value={json.value || '{}'}
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
              onMount={handleEditorDidMount} // onMount를 통해 readOnly 설정
            />
          </div>
        ) : (
          <div>
            <label className='flex items-center text-[16px] font-semibold h-8 mt-4'>Form Data</label>
            {formData.length > 0 ? (
              <>
                <div className='flex h-10 rounded-sm text-[14px] border bg-[#f1f5f8]'>
                  <div className='flex-[0.4] h-10 p-2 text-center border-r'>Requirement</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Key</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Value</div>
                  <div className='flex-1 p-2 h-10 text-center border-r'>Description</div>
                </div>

                {formData.map((data, index) => (
                  <div key={index} className='flex h-10 mt-1 rounded-sm text-[14px] border bg-white'>
                    <div className='flex-[0.4] h-10 p-2 border-r'>{data.isRequired ? 'required' : 'optional'}</div>
                    <div className='flex-1 h-10 p-2 border-r flex items-center justify-between'>
                      <div>{data.key}</div>
                      <div className='w-[55px] bg-white border text-center'>{data.type}</div>
                    </div>
                    <div className='flex-1 h-10 p-2 border-r'>{data.value}</div>
                    <div className='flex-1 h-10 p-2 border-r'>{data.description}</div>
                  </div>
                ))}
              </>
            ) : (
              <div>No Form Data</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryRequest;
