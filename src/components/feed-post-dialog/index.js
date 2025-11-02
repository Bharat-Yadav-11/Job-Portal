"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import supabaseClient from "@/utils/supabaseClient";
import { createFeedPostAction, updateFeedPostAction } from "@/actions";
import { Upload, X, Loader2 } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to prevent SSR errors ("document is not defined")
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md" />
});

export default function FeedPostDialog({ showPostDialog, setShowPostDialog, user, profileInfo, currentEditedItem, setCurrentEditedItem }) {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill the form if we are editing an existing item
  useEffect(() => {
    if (currentEditedItem) {
      setFormData({
        title: currentEditedItem.title,
        description: currentEditedItem.description,
      });
    }
  }, [currentEditedItem]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - imageFiles.length;
    setImageFiles((prev) => [...prev, ...files.slice(0, remainingSlots)]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSavePost = async () => {
    setIsSubmitting(true);
    const uploadPromises = imageFiles.map(async (file) => {
      const uniqueFileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabaseClient.storage.from("job-board-public").upload(`/public/${uniqueFileName}`, file);
      if (error) {
        console.error("Supabase upload error:", error);
        return null;
      }
      const { data: urlData } = supabaseClient.storage.from("job-board-public").getPublicUrl(data.path);
      return urlData.publicUrl;
    });

    const uploadedImageUrls = await Promise.all(uploadPromises);
    const finalImageUrls = uploadedImageUrls.filter(url => url !== null);

    const postData = {
      userId: user?.id,
      userName: profileInfo?.recruiterInfo?.name || profileInfo?.candidateInfo?.name || "Anonymous User",
      title: formData.title,
      description: formData.description,
      // Use new images if available, otherwise keep the old ones during an edit
      images: finalImageUrls.length > 0 ? finalImageUrls : (currentEditedItem?.images || []),
      likes: currentEditedItem?.likes || [],
    };

    if (currentEditedItem) {
      await updateFeedPostAction({ ...currentEditedItem, ...postData }, '/feed');
    } else {
      await createFeedPostAction(postData, '/feed');
    }

    setIsSubmitting(false);
    handleCloseDialog();
  };

  // Resets all state when the dialog is closed
  const handleCloseDialog = () => {
    setShowPostDialog(false);
    setCurrentEditedItem(null);
    setFormData({ title: '', description: '' });
    setImageFiles([]);
  };

  // The button is disabled if there's no title, or if it's currently submitting
  const isPostButtonDisabled = !formData.title.trim() || isSubmitting;

  return (
    <Dialog open={showPostDialog} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-8 bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentEditedItem ? 'Edit Post' : 'Create a New Post'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow flex flex-col gap-6 overflow-y-hidden mt-4">
          <Input
            name="title"
            placeholder="An eye-catching title..."
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="text-xl font-bold h-14 border-2 border-slate-300 dark:border-slate-700 bg-transparent focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          />

          <div className="flex-grow min-h-0 flex flex-col">
            <style>
              {`
                .ql-editor.ql-blank::before {
                  color: #94a3b8; /* slate-400 */
                }
                .dark .ql-editor.ql-blank::before {
                  color: #475569; /* slate-600 */
                }
              `}
            </style>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
              className="h-full flex-grow [&_.ql-container]:flex-grow [&_.ql-container]:overflow-y-auto [&_.ql-container]:rounded-b-md [&_.ql-toolbar]:rounded-t-md [&_.ql-container]:border-slate-300 [&_.ql-container]:dark:border-slate-700 [&_.ql-toolbar]:border-slate-300 [&_.ql-toolbar]:dark:border-slate-700"
              placeholder="Share your thoughts, projects, or achievements..."
            />
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <label htmlFor="image-upload" className="flex items-center gap-2 cursor-pointer text-indigo-500 hover:text-indigo-600 font-semibold disabled:opacity-50 mt-6">
              <Upload size={20} />
              <span>{imageFiles.length > 0 ? `Add more (${imageFiles.length}/5)` : 'Upload Images (Max 5)'}</span>
            </label>
            <Input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} disabled={imageFiles.length >= 5} />
            <div className="mt-4 grid grid-cols-5 gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative w-full aspect-square border rounded-lg group">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute top-1 right-1">
                    <button onClick={() => handleRemoveImage(index)} className="p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <Button onClick={handleSavePost} disabled={isPostButtonDisabled}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : (currentEditedItem ? 'Update Post' : 'Create Post')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}