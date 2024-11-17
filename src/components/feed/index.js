"use client";

import { Fragment, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { CirclePlus, Heart } from "lucide-react";
import { Input } from "../ui/input";
import { createClient } from "@supabase/supabase-js";
import { createFeedPostAction, updateFeedPostAction } from "@/actions";

const supabaseClient = createClient(
  "https://dkxfxbntwhjzboylvwnh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreGZ4Ym50d2hqemJveWx2d25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNDgwNDUsImV4cCI6MjA0NjkyNDA0NX0.3rErx-i1BZdik9mM96vOE0XGXDo-UvdbAqeDAskMP-c"
);

function Feed({ user, profileInfo, allFeedPosts }) {
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    imageURL: "",
  });
  const [imageData, setImageData] = useState(null);
  const [likedPostId, setLikedPostId] = useState(null); // Track the post that was liked
  const [isAnimating, setIsAnimating] = useState(false);

  function handleFileOnChange(event) {
    event.preventDefault();
    setImageData(event.target.files[0]);
  }

  async function handleUploadImageToSupabase() {
    if (!imageData) {
      console.error("No image data found.");
      return null;
    }

    const uniqueFileName = `${Date.now()}_${imageData.name}`;
    const { data, error } = await supabaseClient.storage
      .from("job-board-public")
      .upload(`/public/${uniqueFileName}`, imageData, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    // Fetch and return the public URL of the uploaded image
    const publicUrl = await fetchPublicUrl(data.path);
    return publicUrl;
  }

  async function fetchPublicUrl(path) {
    const { data, error } = await supabaseClient.storage
      .from("job-board-public")
      .getPublicUrl(path);

    if (data) {
      return data.publicUrl;
    } else {
      console.error("Error fetching public URL:", error);
      return null;
    }
  }

  async function handleSaveFeedPost() {
    if (imageData) {

      const imageUrl = await handleUploadImageToSupabase();

      if (imageUrl) {
        // Once the image is uploaded and we have the URL, save the post with the URL
        console.log("Saving post with image URL:", imageUrl);
        await createFeedPostAction(
          {
            userId: user?.id,
            userName: profileInfo?.candidateInfo?.name || profileInfo?.recruiterInfo?.name,
            message: formData?.message,
            image: imageUrl,  // Image URL is now set
            likes: [],
          },
          "/feed"
        );

        setFormData({
          imageURL: "",
          message: "",
        });
      } else {
        console.error("Image upload failed. Post not saved.");
      }
    }
  }

  async function handleUpdateFeedPostLikes(getCurrentFeedPostItem) {
    let cpyLikesFromCurrentFeedPostItem = [...getCurrentFeedPostItem.likes];
    const index = cpyLikesFromCurrentFeedPostItem.findIndex(
      (likeItem) => likeItem.reactorUserId === user?.id
    );

    if (index === -1)
      cpyLikesFromCurrentFeedPostItem.push({
        reactorUserId: user?.id,
        reactorUserName:
          profileInfo?.candidateInfo?.name || profileInfo?.recruiterInfo?.name,
      });
    else cpyLikesFromCurrentFeedPostItem.splice(index, 1);

    getCurrentFeedPostItem.likes = cpyLikesFromCurrentFeedPostItem;
    await updateFeedPostAction(getCurrentFeedPostItem, "/feed");

    setLikedPostId(getCurrentFeedPostItem._id); // Track the liked post ID
    setIsAnimating(true); // Start animation
    setTimeout(() => setIsAnimating(false), 250); // Reset animation after 250ms
  }

  useEffect(() => {
    if (imageData) {
      handleUploadImageToSupabase();  // Trigger the image upload only when imageData changes
    }
  }, [imageData]);

  return (
    <Fragment>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-baseline justify-between dark:border-white border-b pb-6 pt-24">
          <h1 className="dark:text-white text-4xl font-bold tracking-tight text-gray-900">
            Explore Feed
          </h1>
          <div className="flex items-center">
            <Button
              onClick={() => setShowPostDialog(true)}
              className="flex h-11 items-center justify-center px-5"
            >
              Add New Post
            </Button>
          </div>
        </div>
        <div className="py-12">
          <div className="container m-auto p-0 flex flex-col gap-5 text-gray-700">
            {allFeedPosts && allFeedPosts.length > 0 ? (
              allFeedPosts.map((feedPostItem) => (
                <div
                  key={feedPostItem._id}
                  className="group relative -mx-4 p-6 rounded-3xl bg-gray-100 hover:bg-white hover:shadow-2xl cursor-auto shadow-2xl shadow-transparent gap-8 flex"
                >
                  <div className="sm:w-2/6 rounded-3xl overflow-hidden transition-all duration-500 group-hover:rounded-xl">
                    <img
                      src={feedPostItem?.image}
                      alt="Post"
                      className="h-80 w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="sm:p-2 sm:pl-0 sm:w-4/6">
                    <span className="mt-4 mb-2 inline-block font-medium text-gray-500 sm:mt-0">
                      {feedPostItem?.userName}
                    </span>
                    <h3 className="mb-6 text-4xl font-bold text-gray-900">
                      {feedPostItem?.message}
                    </h3>
                    <div className="flex gap-5">
                      <Heart
                        size={25}
                        fill={
                          feedPostItem?.likes.some((likeItem) => likeItem.reactorUserId === user?.id)
                            ? "#000000" // Black if the post is liked
                            : "#ffffff" // White if the post is not liked
                        }
                        className={`cursor-pointer transition-transform duration-300 ${likedPostId === feedPostItem._id && isAnimating
                          ? "scale-150"
                          : "scale-100"
                          }`} // Add scaling effect
                        onClick={() => handleUpdateFeedPostLikes(feedPostItem)}
                      />
                      <span className="font-semibold text-xl">
                        {feedPostItem?.likes?.length}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1>No posts found!</h1>
            )}
          </div>
        </div>
      </div>
      <Dialog
        open={showPostDialog}
        onOpenChange={() => {
          setShowPostDialog(false);
          setFormData({
            message: "",
            imageURL: "",
          });
        }}
      >
        <DialogContent className="h-[550px]">
          <Textarea
            name="message"
            value={formData?.message}
            onChange={(event) =>
              setFormData({
                ...formData,
                message: event.target.value,
              })
            }
            placeholder="What do you want to talk about?"
            className="border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-[200px] text-[28px]"
          />

          <div className="flex gap-5 items-center justify-between">
            <Label for="imageURL">
              <CirclePlus />
              <Input
                onChange={handleFileOnChange}
                className="hidden"
                id="imageURL"
                type="file"
              />
            </Label>
            <Button
              onClick={handleSaveFeedPost}
              disabled={formData?.imageURL === "" && formData?.message === ""}
              className="flex w-40 h-11 items-center justify-center px-5 disabled:opacity-65"
            >
              Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default Feed;
