import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';

const Comment = ({ comment, noComment }) => {
  return (
    <div className="flex place-items-start gap-2">
      <ChatBubbleBottomCenterIcon className="size-6" />
      <p>&bdquo;{comment ? comment : noComment}&ldquo;</p>
    </div>
  );
};

export default Comment;
