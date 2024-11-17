<div
  className='relative w-[calc(100%-350px)] h-full'
  onMouseEnter={() => (editorStatus.isOccupiedByOthers ? setShowTooltip(true) : null)}
  onMouseLeave={() => setShowTooltip(false)}
  ref={editorRef}
  onMouseMove={handleMouseMove}
>
  <h3>Edit</h3>
  <Editor
    height='230px'
    className='transition duration-300 border text-[14px] rounded-md'
    style={{
      borderColor: editorStatus.isOccupied ? editorStatus.color : undefined,
      boxShadow: editorStatus.isOccupied ? `0 0 0 2px ${editorStatus.color}` : undefined,
    }}
    language='json'
    value={JSON.stringify(response?.value || {}, null, 2)}
    onChange={handleEditorChange}
    onMount={handleEditorMount}
    options={{
      automaticLayout: true,
      autoClosingBrackets: 'always',
      formatOnType: true,
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      cursorStyle: 'line',
      readOnly: false,
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      selectionHighlight: true,
      contextmenu: true,
      minimap: {
        enabled: false,
        renderCharacters: false,
        showSlider: 'mouseover',
        decorations: false,
      },
    }}
  />
  {editorStatus.isOccupiedByOthers && showTooltip && (
    <div
      className={`absolute w-[100px] bg-white shadow-md rounded-lg p-2 z-[9000]`}
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left + 10,
      }}
    >
      <div className='flex items-center space-x-2'>
        <img src={editorStatus.profileImage} alt={editorStatus.nickname} className='w-6 h-6 rounded-full' />
        <div className='mx-0 text-sm font-medium'>{editorStatus.nickname}</div>
      </div>
    </div>
  )}
</div>;

const handleEditorChange = (value) => {
  try {
    const parsedJson = JSON.parse(value);
    setResponse({ value: parsedJson });

    publish(`/ws/pub/workspaces/${workspaceId}/apis/${apiId}`, {
      apiType: 'REQUEST_JSON',
      actionType: 'UPDATE',
      message: { value: value },
    });
  } catch (e) {}
};

const handleEditorMount = (editor) => {
  editor.getAction('editor.action.formatDocument').run();
};
const [selectedResponse, setSelectedResponse] = useState(null);
