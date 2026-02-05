import { Save, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { useFetcher } from 'react-router';

interface TodoListInfo {
  id: number;
  defaulttitle: string;
  className?: string;
  isOwner?: boolean;
  onOptimisticUpdate?: (update: {
    type: string;
    id: number;
    title?: string;
    description?: string;
  }) => void;
}

export default function TodoListEdit({
  id,
  defaulttitle,
  className,
  isOwner,
  onOptimisticUpdate,
}: TodoListInfo) {
  const Fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(defaulttitle);
  const [description, setDescription] = useState('');
  return (
    <div className={'flex justify-between ' + className}>
      <div
        className={`flex max-lg:*:max-w-[20vw] ${
          !isEditing ? '*:bg-transparent' : ''
        }`}
      >
        <input
          type="text"
          disabled={!isEditing}
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <input
          type="text"
          placeholder={isEditing ? 'description' : ''}
          disabled={!isEditing}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </div>
      {isOwner === undefined || !isOwner ? null : (
        <button
          className="lg:p-2"
          onClick={() => {
            if (isEditing) {
              if (defaulttitle === title) return setIsEditing(false);
              onOptimisticUpdate?.({
                type: 'updateInfo',
                id,
                title,
                description,
              });
              const formData = new FormData();
              formData.append('id', id.toString());
              formData.append('title', title);
              formData.append('description', description);
              formData.append('type', 'updateInfo');
              Fetcher.submit(formData, {
                action: '/api/todolist',
                method: 'PUT',
              });
            }
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? <Save /> : <SquarePen />}
        </button>
      )}
    </div>
  );
}
