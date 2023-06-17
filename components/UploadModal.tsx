'use client';

import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import uniqid from 'uniqid';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';

import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useRouter } from 'next/navigation';

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Misssing fields');
        return;
      }

      const uniqueId = uniqid();

      const { data: songData, error: songError } = await supabaseClient.storage
        .from('songs')
        .upload(`song-${values.title}-${uniqueId}`, songFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (songError) {
        setIsLoading(false);
        return toast.error('Failed upload song');
      }

      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from('images')
          .upload(`image-${values.title}-${uniqueId}`, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

      if (imageError) {
        setIsLoading(false);
        return toast.error("Failed upload song's cover");
      }

      const { error: uploadError } = await supabaseClient.from('songs').insert({
        user_id: user.id,
        title: values.title,
        author: values.author,
        image_path: imageData.path,
        song_path: songData.path,
      });

      if (uploadError) {
        setIsLoading(false);
        return toast.error(uploadError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Song successfully uploaded.');
    } catch (error) {
      toast.error('something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song Title..."
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song's Author..."
        />
        <div>
          <div className="pb-1">Select song</div>
          <Input
            id="song"
            type="file"
            accept=".mp3"
            disabled={isLoading}
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">Select song's cover</div>
          <Input
            id="image"
            type="file"
            accept="image/*"
            disabled={isLoading}
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit" className="text-white">
          Upload
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
