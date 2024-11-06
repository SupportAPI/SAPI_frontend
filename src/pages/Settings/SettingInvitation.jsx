import { useUserInvitedList, useInvitedAccept, useInvitedRefuse } from '../../api/queries/useWorkspaceQueries';
import { toast } from 'react-toastify';

const UserInvitation = () => {
  const { data: InvitedList } = useUserInvitedList();
  const AcceptMutation = useInvitedAccept();
  const RefuseMutation = useInvitedRefuse();

  const handleAccept = (membershipId) => {
    AcceptMutation.mutate(membershipId, {
      onSuccess: () => {
        console.log('초대 수락 완료');
        toast('워크스페이스에 가입되셨습니다.');
      },
      onError: (error) => {
        console.error('초대 수락 실패:', error);
        toast('비정상적인 오류로 가입에 실패하였습니다.');
      },
    });
  };

  const handleRefuse = (membershipId) => {
    RefuseMutation.mutate(membershipId, {
      onSuccess: () => {
        console.log('초대 거절 완료');
        toast('워크스페이스에 가입에 거절하셨습니다.');
      },
      onError: (error) => {
        console.error('초대 거절 실패:', error);
        toast('비정상적인 오류로 거절에 실패하였습니다.');
      },
    });
  };

  return (
    <div className='m-10'>
      <div className='flex flex-col'>
        <div className='text-2xl mb-5'>Invitation</div>
        <div className='border'></div>

        <div className='flex flex-col h-[500px] mt-10 p-2 border overflow-y-auto sidebar-scrollbar'>
          {InvitedList &&
            InvitedList.map((invite, index) => (
              <div className='flex justify-between border-none hover:bg-blue-100 p-2 rounded-lg' key={index}>
                <div className='flex'>
                  <img
                    className='border rounded-full w-14 h-14 mr-2 object-contain'
                    src={invite.mainImage}
                    alt='프로필 이미지'
                  />

                  <div className='flex flex-col justify-center w-[220px]'>
                    {/* invite 객체의 속성들을 렌더링하세요 */}
                    <p className='truncate'>{`'${invite.projectName}'에 초대되셨습니다.`}</p>
                    <p className='text-sm text-gray-500 truncate'>{invite.description}</p>
                  </div>
                </div>

                <div className='flex justify-between items-center'>
                  <button
                    className='w-[50px] h-[40px] ml-3 rounded-lg bg-green-500 hover:bg-green-600 text-white'
                    onClick={() => {
                      handleAccept(invite.membershipId);
                    }}
                  >
                    수락
                  </button>
                  <button
                    className='w-[50px] h-[40px] ml-3 rounded-lg bg-red-500 hover:bg-red-600 text-white'
                    onClick={() => {
                      handleRefuse(invite.membershipId);
                    }}
                  >
                    거절
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserInvitation;
