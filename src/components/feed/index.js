"use client";

import { Fragment, useState, useOptimistic, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FeedCommonCard from "@/components/feed-common-card";
import { deleteFeedPostAction, updateFeedPostAction } from "@/actions";
import FeedPostDialog from "@/components/feed-post-dialog";
import { LayoutGrid, Rows3, Heart, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Feed({ allFeedPosts, profileInfo, user }) {
  const [view, setView] = useState("table");
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [currentEditedItem, setCurrentEditedItem] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setView('grid');
      } else {
        setView('table');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [optimisticPosts, setOptimisticPosts] = useOptimistic(
    allFeedPosts,
    (state, { action, post }) => {
      switch (action) {
        case "like":
          return state.map(p => p._id === post._id ? { ...p, likes: post.likes } : p);
        case "delete":
          return state.filter(p => p._id !== post.id);
        default:
          return state;
      }
    }
  );

  useEffect(() => {
    if (!showPostDialog) {
      setCurrentEditedItem(null);
    }
  }, [showPostDialog]);

  function handleEdit(item) {
    setCurrentEditedItem(item);
    setShowPostDialog(true);
  }

  async function handleDelete(id) {
    setOptimisticPosts({ action: "delete", post: { id } });
    await deleteFeedPostAction(id, "/feed");
  }

  async function handleUpdateLikes(getCurrentFeedPostItem) {
    let cpyLikes = [...getCurrentFeedPostItem.likes];
    const index = cpyLikes.findIndex(item => item.reactorUserId === user?.id);

    if (index === -1) {
      cpyLikes.push({
        reactorUserId: user?.id,
        reactorUserName: profileInfo?.recruiterInfo?.name || profileInfo?.candidateInfo?.name,
      });
    } else {
      cpyLikes.splice(index, 1);
    }

    setOptimisticPosts({
      ...getCurrentFeedPostItem,
      likes: cpyLikes
    });

    await updateFeedPostAction({
      _id: getCurrentFeedPostItem._id,
      likes: cpyLikes
    }, "/feed");
  }

  return (
    <Fragment>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-slate-200 dark:border-slate-700 pb-6 pt-16 gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Explore Feed
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <button onClick={() => setView('table')} className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors ${view === 'table' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>
                <Rows3 size={20} className={view === 'table' ? 'text-slate-900 dark:text-white' : 'text-slate-500'} />
                <span className={view === 'table' ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500'}>Table</span>
              </button>
              <button onClick={() => setView('grid')} className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors ${view === 'grid' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>
                <LayoutGrid size={20} className={view === 'grid' ? 'text-slate-900 dark:text-white' : 'text-slate-500'} />
                <span className={view === 'grid' ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500'}>Grid</span>
              </button>
            </div>
            <Button
              onClick={() => { setCurrentEditedItem(null); setShowPostDialog(true); }}
              className="flex h-11 items-center justify-center px-5"
            >
              Add New Post
            </Button>
          </div>
        </div>

        {/* CONDITIONAL VIEWS */}
        {view === 'grid' ? (
          <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {optimisticPosts.map((item) => (
              <FeedCommonCard
                key={item._id} item={item}
                isCurrentUser={profileInfo?._id === item.userId || user?.id === item.userId}
                handleEdit={() => handleEdit(item)}
                handleDelete={() => handleDelete(item._id)}
                handleUpdateLikes={() => handleUpdateLikes(item)}
                loggedInUser={user}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 max-w-5xl mx-auto flex flex-col gap-8">
            {optimisticPosts.map((item) => (
              <div key={item._id} className="group relative p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="flex gap-8">
                  <div className="w-full md:w-2/6 h-60  rounded-xl overflow-hidden cursor-pointer" onClick={() => router.push(`/feed/${item._id}`)}>
                    <img src={item?.images[0]} alt="Post" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="w-full md:w-4/6 flex flex-col h-60">
                    <span className="mb-2 inline-block font-medium text-slate-500 dark:text-slate-400">Posted by {item?.userName}</span>
                    <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white overflow-hidden">{item?.title}</h3>
                    <div className="text-slate-600 dark:text-slate-300 line-clamp-3 flex-grow overflow-hidden prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: item.description }} />
                    <div className="flex items-center gap-5 mt-6">
                      <motion.div whileTap={{ scale: 1.5 }}>
                        <Heart
                          size={25}
                          fill={item.likes.some(like => like.reactorUserId === user?.id) ? "red" : "none"}
                          stroke={item.likes.some(like => like.reactorUserId === user?.id) ? "red" : "currentColor"}
                          className="cursor-pointer text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500"
                          onClick={() => handleUpdateLikes(item)}
                        />
                      </motion.div>
                      <span className="font-semibold text-xl text-slate-700 dark:text-slate-200">{item?.likes?.length}</span>
                    </div>
                  </div>
                </div>
                {(profileInfo?._id === item.userId || user?.id === item.userId) && (
                  <div className="absolute top-4 right-4 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setTimeout(() => handleEdit(item), 0)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item._id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <FeedPostDialog
        key={currentEditedItem ? currentEditedItem._id : "new-post"}
        showPostDialog={showPostDialog}
        setShowPostDialog={setShowPostDialog}
        user={user} profileInfo={profileInfo}
        currentEditedItem={currentEditedItem}
        setCurrentEditedItem={setCurrentEditedItem}
      />
    </Fragment>
  );
}