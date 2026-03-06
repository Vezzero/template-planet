export type MemeBaseWithRelations = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
  fileType: "IMAGE" | "GIF" | "VIDEO" | "TEMPLATE";
  width: number | null;
  height: number | null;
  fileSize: number | null;
  blurHash: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  upvotesCount: number;
  downloadsCount: number;
  viewsCount: number;
  trendingScore: number;
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date | null;
  author: {
    id: string;
    username: string;
    image: string | null;
    name: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    iconEmoji: string;
    color: string;
  } | null;
  tags: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  _userHasUpvoted?: boolean;
};

export type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconEmoji: string;
  color: string;
  order: number;
  _count: { bases: number };
};

export type TagWithCount = {
  id: string;
  name: string;
  slug: string;
  _count: { bases: number };
};

export type SortOption = "trending" | "newest" | "top";
export type FileTypeFilter = "ALL" | "IMAGE" | "GIF" | "VIDEO" | "TEMPLATE";

export type SearchParams = {
  q?: string;
  category?: string;
  tag?: string;
  type?: FileTypeFilter;
  sort?: SortOption;
  page?: string;
};
