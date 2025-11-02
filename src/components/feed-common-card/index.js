"use client";

import { MoreVertical, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function FeedCommonCard({
  item,
  isCurrentUser,
  handleEdit,
  handleDelete,
  handleUpdateLikes,
  loggedInUser,
}) {
  const router = useRouter();
  const isLiked = item.likes.some(like => like.reactorUserId === loggedInUser?.id);

  return (
    <div className="relative flex flex-col items-start w-full shadow-lg rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
      {isCurrentUser && (
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="p-2 rounded-full bg-black/10 backdrop-blur-lg hover:bg-black/20 transition-colors">
                <MoreVertical size={20} className="text-white" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="w-full h-48 overflow-hidden rounded-t-xl cursor-pointer" onClick={() => router.push(`/feed/${item._id}`)}>
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="p-4 w-full">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">{item.userName}</span>
          <div className="flex items-center gap-2">
            <Heart
              size={20}
              fill={isLiked ? "red" : "none"}
              stroke={isLiked ? "red" : "currentColor"}
              className="cursor-pointer text-slate-500 hover:text-red-500 transition-colors"
              onClick={handleUpdateLikes}
            />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{item.likes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}