import ParametersAuthType from './ParametersAuthType';
import ParametersCookies from './ParametersCookies';
import ParametersHeaders from './ParametersHeaders';
import ParametersQueryParameters from './ParametersQueryParameters';

const Parameters = ({ apiDocDetail, apiId, workspaceId, occupationState, handleOccupationState }) => {
  return (
    <div>
      <ParametersAuthType
        apiDocDetail={apiDocDetail}
        apiId={apiId}
        workspaceId={workspaceId}
        occupationState={occupationState}
        handleOccupationState={handleOccupationState}
      />
      <ParametersHeaders
        apiDocDetail={apiDocDetail}
        apiId={apiId}
        workspaceId={workspaceId}
        occupationState={occupationState}
        handleOccupationState={handleOccupationState}
      />
      <ParametersQueryParameters
        apiDocDetail={apiDocDetail}
        apiId={apiId}
        workspaceId={workspaceId}
        occupationState={occupationState}
        handleOccupationState={handleOccupationState}
      />
      <ParametersCookies
        apiDocDetail={apiDocDetail}
        apiId={apiId}
        workspaceId={workspaceId}
        occupationState={occupationState}
        handleOccupationState={handleOccupationState}
      />
    </div>
  );
};

export default Parameters;
