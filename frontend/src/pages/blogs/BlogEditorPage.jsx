import { useState } from 'react';
import TitleInput from '@/components/TitleInput';
import CoverImageUploader from '@/components/CoverImageUploader';
import TagsInput from '@/components/TagsInput';
import PublishButton from '@/components/PublishButton';
import RichTextEditor from '@/components/RichTextEditor';
import { useTags } from '@/hooks/useTags'
import { useFormValidation } from '@/hooks/useFormValidation'
import { useAuthContext } from '@/context/auth-context';
import useFetch from '@/hooks/useFetch';

const BlogEditor = () => {
    const [title, setTitle] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [content, setContent] = useState('');

    const { tags } = useTags();
    const { validateForm, validationErrors } = useFormValidation(title);
    const { user } = useAuthContext();
    const { data, fetchData } = useFetch()


    const handleSubmit = async () => {

        const formData = {
            title,
            content,
            tags,
            authorEmail: user.email,
            published: true,
            coverImageUrl: coverImage
        }
        if (!validateForm(formData)) {
            return;
        }
        setIsSaving(true);
        try {
            await fetchData('uploadBlog')
            console.log(data)
        } catch (error) {
            console.error('Error publishing post:', error);
        } finally {
            setIsSaving(false);
        }
    };



    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Create New Blog Post</h1>

            <TitleInput validationErrors={validationErrors} title={title} setTitle={setTitle} />

            {/* Cover image upload */}
            <CoverImageUploader coverImagePreview={coverImagePreview} setCoverImage={setCoverImage} setCoverImagePreview={setCoverImagePreview} />


            {/* Rich text editor toolbar */}

            <RichTextEditor title={title} tags={tags} coverImage={coverImage} validationErrors={validationErrors} content={content} setContent={setContent} />
            {/* Tags Input */}
            <TagsInput />

            {/* Publish Button */}
            <PublishButton handleSubmit={handleSubmit} isSaving={isSaving} />
        </div>
    );
};

export default BlogEditor;