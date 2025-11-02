import { fetchFeedPostDetailsAction } from "@/actions";
import ImageCarousel from "@/components/image-carousel";
import { currentUser } from "@clerk/nextjs";

export default async function FeedPostDetails({ params }) {
  const user = await currentUser();
  const postDetails = await fetchFeedPostDetailsAction(params.id);

  if (!postDetails) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6">
        <p className="text-lg text-slate-600 dark:text-slate-400">Could not find the post you're looking for.</p>
      </div>
    );
  }

  const carouselImages = postDetails.images.map(imgUrl => ({
    image: imgUrl,
    quote: '',
    name: postDetails.title,
    title: `By ${postDetails.userName}`,
  }));

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#111827]">
      <div className="container mx-auto px-6 py-12">
        {carouselImages && carouselImages.length > 0 && (
          <div className="mb-12">
            <ImageCarousel images={carouselImages} />
          </div>
        )}

        <div className="max-w-4xl mx-auto  bg-slate-200 dark:bg-black p-10 rounded-lg">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">{postDetails.title}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Posted by {postDetails.userName}</p>

          <div className="
            mt-8 prose prose-lg sm:prose-sm max-w-none
            dark:prose-invert 
            prose-p:leading-relaxed
           prose-li:marker:text-slate-500 dark:prose-li:marker:text-slate-400
           prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
           dark:prose-a:text-indigo-400"
            dangerouslySetInnerHTML={{ __html: postDetails.description }} />
        </div>
      </div>
    </div>
  );
}