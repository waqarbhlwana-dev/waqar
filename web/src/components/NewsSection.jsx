import { useState, useEffect } from "react";
import { Clock, Eye, TrendingUp, ExternalLink, Filter, Search } from "lucide-react";

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Mock news data - in real app, this would come from news API
  useEffect(() => {
    const mockNews = [
      {
        id: 1,
        title: "Pakistan Stock Exchange reaches new heights as KSE-100 crosses 45,000 points",
        summary: "The benchmark KSE-100 index gained significant momentum today, driven by strong performance in banking and cement sectors...",
        category: "Market",
        author: "Business Reporter",
        publishedAt: "2 hours ago",
        views: "2.3K",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
        isBreaking: true
      },
      {
        id: 2,
        title: "State Bank of Pakistan announces new monetary policy decisions",
        summary: "Central bank maintains interest rates at current levels amid economic stabilization efforts and inflation concerns...",
        category: "Policy",
        author: "Economic Correspondent",
        publishedAt: "4 hours ago",
        views: "1.8K",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop",
        isBreaking: false
      },
      {
        id: 3,
        title: "Oil & Gas sector shows strong recovery with OGDC leading gains",
        summary: "Oil and Gas Development Company Limited posted impressive quarterly results, boosting investor confidence in the energy sector...",
        category: "Sector",
        author: "Energy Analyst",
        publishedAt: "6 hours ago",
        views: "1.5K",
        image: "https://images.unsplash.com/photo-1586992427003-79eb881b1cee?w=400&h=200&fit=crop",
        isBreaking: false
      },
      {
        id: 4,
        title: "Foreign investment flows increase by 25% in textile sector",
        summary: "International investors show renewed interest in Pakistan's textile industry following government incentive packages...",
        category: "Investment",
        author: "Trade Reporter",
        publishedAt: "8 hours ago",
        views: "1.2K",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=200&fit=crop",
        isBreaking: false
      },
      {
        id: 5,
        title: "Technology stocks surge as IT exports reach record highs",
        summary: "Pakistan's IT sector continues its impressive growth trajectory with exports crossing $2.5 billion mark this fiscal year...",
        category: "Technology",
        author: "Tech Correspondent",
        publishedAt: "10 hours ago",
        views: "2.1K",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
        isBreaking: false
      },
      {
        id: 6,
        title: "Banking sector consolidation talks gain momentum",
        summary: "Major Pakistani banks explore merger opportunities to strengthen capital base and improve operational efficiency...",
        category: "Banking",
        author: "Financial Editor",
        publishedAt: "12 hours ago",
        views: "1.9K",
        image: "https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400&h=200&fit=crop",
        isBreaking: false
      }
    ];

    setNews(mockNews);
    setIsLoading(false);
  }, []);

  const categories = ["All", "Market", "Policy", "Sector", "Investment", "Technology", "Banking"];

  // Filter news based on search term and category
  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatViews = (views) => {
    if (views.includes('K')) return views;
    const num = parseInt(views);
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return views;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm border border-gray-200 dark:border-[#333333] p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-[#404040] rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-3">
                <div className="h-48 bg-gray-200 dark:bg-[#404040] rounded-lg"></div>
                <div className="h-4 bg-gray-200 dark:bg-[#404040] rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-[#404040] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm border border-gray-200 dark:border-[#333333] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-[#333333]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-poppins text-[#111827] dark:text-[#E0E0E0] mb-2">
              Market News & Reports
            </h2>
            <p className="text-sm font-poppins text-[#6B7280] dark:text-[#A0A0A0]">
              Latest updates from Pakistan's financial markets
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex items-center bg-[#F8FAFC] dark:bg-[#333333] border border-[#E1E4EA] dark:border-[#404040] rounded-lg px-3 py-2 min-w-[250px]">
              <Search className="w-4 h-4 text-[#6B7280] dark:text-[#A0A0A0] mr-2" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm font-poppins text-[#111827] dark:text-[#E0E0E0] placeholder-[#6B7280] dark:placeholder-[#A0A0A0] w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#6B7280] dark:text-[#A0A0A0]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#F8FAFC] dark:bg-[#333333] border border-[#E1E4EA] dark:border-[#404040] rounded-lg px-3 py-2 font-poppins text-sm text-[#111827] dark:text-[#E0E0E0] focus:border-[#FF7A00] dark:focus:border-[#FF8F1F] focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="p-6">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#F3F4F6] dark:bg-[#404040] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-[#6B7280] dark:text-[#A0A0A0]" />
            </div>
            <h3 className="text-lg font-medium font-poppins text-[#111827] dark:text-[#E0E0E0] mb-2">
              No news found
            </h3>
            <p className="text-sm font-poppins text-[#6B7280] dark:text-[#A0A0A0]">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map(article => (
              <article
                key={article.id}
                className="group cursor-pointer bg-[#F8FAFC] dark:bg-[#333333] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 border border-transparent hover:border-[#FF8200] dark:hover:border-[#FF8F1F]"
              >
                {/* Article Image */}
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {article.isBreaking && (
                    <div className="absolute top-3 left-3 bg-[#EF4444] text-white px-2 py-1 rounded text-xs font-semibold font-poppins">
                      BREAKING
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-[#FF8200] dark:bg-[#FF8F1F] text-white px-2 py-1 rounded text-xs font-medium font-poppins">
                    {article.category}
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-4">
                  <h3 className="font-poppins text-lg font-semibold text-[#111827] dark:text-[#E0E0E0] mb-2 line-clamp-2 group-hover:text-[#FF8200] dark:group-hover:text-[#FF8F1F] transition-colors duration-200">
                    {article.title}
                  </h3>
                  
                  <p className="font-poppins text-sm text-[#6B7280] dark:text-[#A0A0A0] mb-4 line-clamp-3">
                    {article.summary}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center justify-between text-xs font-poppins text-[#6B7280] dark:text-[#A0A0A0]">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.publishedAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatViews(article.views)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{article.author}</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredNews.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-[#FF8200] dark:bg-[#FF8F1F] text-white rounded-lg font-poppins font-medium hover:bg-[#E56B00] dark:hover:bg-[#FF8200] active:bg-[#CC5500] dark:active:bg-[#E56B00] transition-all duration-200 flex items-center gap-2 mx-auto">
              <TrendingUp className="w-4 h-4" />
              Load More News
            </button>
          </div>
        )}
      </div>

      {/* Poppins Font */}
      <style jsx global>{`
        .font-poppins {
          font-family: 'Poppins', 'Inter', sans-serif;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}