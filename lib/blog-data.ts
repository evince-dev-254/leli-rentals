import { StaticImageData } from "next/image"

export type Author = {
    name: string
    role: string
    avatar: string
    bio?: string
    twitter?: string
    linkedin?: string
}

export type BlogPost = {
    slug: string
    title: string
    excerpt: string
    content: string
    coverImage: string
    date: string
    author: Author
    category: string
    tags: string[]
    readingTime: string
    featured?: boolean
}

export const categories = [
    "Rental Tips",
    "Market Insights",
    "Platform Updates",
    "Safety & Trust",
    "Guides",
]

export const authors: Record<string, Author> = {
    sarah: {
        name: "Sarah Kimani",
        role: "Content Manager",
        avatar: "/avatars/sarah.jpg",
        bio: "Passionate about the sharing economy and helping people discover new ways to access what they need.",
        twitter: "https://twitter.com/sarahkimani",
        linkedin: "https://linkedin.com/in/sarahkimani",
    },
    david: {
        name: "David Owino",
        role: "Head of Operations",
        avatar: "/avatars/david.jpg",
        bio: "Expert in logistics and rental market dynamics across East Africa.",
        twitter: "https://twitter.com/davidowino",
    },
    leli: {
        name: "Leli Team",
        role: "Admin",
        avatar: "/logo.png",
        bio: "Official updates and news from the Leli Rentals team.",
    },
}

export const blogPosts: BlogPost[] = [
    {
        slug: "top-10-tips-first-time-renters-kenya",
        title: "Top 10 Tips for First-Time Renters in Kenya",
        excerpt: "New to renting? Here's everything you need to know to have a smooth, safe, and enjoyable rental experience on Leli Rentals.",
        content: `
      <h2>1. Verify the Owner's Profile</h2>
      <p>Before booking any item, take a moment to check the owner's profile. Look for verified badges, read reviews from other renters, and see how long they've been on the platform. A complete profile is often a good sign of a trustworthy owner.</p>

      <h2>2. Read the Listing Description Carefully</h2>
      <p>Don't just look at the photos. Read the full description to understand exactly what is included. Does the car come with full fuel? Is the camera lens included with the body? Knowing these details upfront prevents misunderstandings later.</p>

      <h2>3. Check the Cancellation Policy</h2>
      <p>Life happens, and plans change. Make sure you understand the cancellation policy for the item you're renting. tailored policies range from flexible to strict, so choose one that fits your comfort level.</p>

      <h2>4. Inspect the Item at Pickup</h2>
      <p>When you meet the owner to pick up the item, do a quick inspection together. Take photos of any existing scratches or damage. This protects both you and the owner in case of a dispute later.</p>

      <h2>5. Communicate Clearly</h2>
      <p>Use the Leli Rentals messaging system to ask questions before you book. Clear communication about pickup times, return expectations, and usage rules sets the stage for a great experience.</p>

      <h2>6. Respect the Equipment</h2>
      <p>Treat the rented item as if it were your own—or better. Returning items in the same condition you received them builds your reputation as a renter and leads to better reviews.</p>

      <h2>7. Be on Time</h2>
      <p>Punctuality is key in the peer-to-peer rental market. If you're running late for pickup or return, let the owner know as soon as possible. Being respectful of the owner's time goes a long way.</p>

      <h2>8. Understand the Insurance Coverage</h2>
      <p>Leli Rentals offers protection plans for many items. Make sure you understand what is covered and what isn't. For high-value items like vehicles or specialized equipment, consider opting for additional coverage if available.</p>

      <h2>9. Leave a Review</h2>
      <p>After your rental is complete, leave an honest review. This helps the community grow and helps other renters make informed decisions.</p>

      <h2>10. Explore Different Categories</h2>
      <p>Don't limit yourself! From camping gear for a weekend getaway to a projector for a movie night, Leli Rentals has a vast array of categories. Explore and discover what else you can rent instead of buy.</p>
    `,
        coverImage: "/blog/renter-tips.jpg",
        date: "2025-05-15",
        author: authors.sarah,
        category: "Rental Tips",
        tags: ["Tips", "Beginners", "Safety"],
        readingTime: "5 min read",
        featured: true,
    },
    {
        slug: "maximize-rental-income-leli",
        title: "How to Maximize Your Rental Income on Leli",
        excerpt: "Turn your underutilized assets into a steady income stream. Learn the secrets of top-earning owners on our platform.",
        content: `
      <p>Are your assets gathering dust when they could be earning you money? Whether it's a car, a spare room, or professional camera gear, renting it out on Leli Rentals is a smart financial move. Here is how to maximize your earnings.</p>

      <h2>1. High-Quality Photos are Non-Negotiable</h2>
      <p>Listings with professional-looking photos get 40% more bookings. You don't need a DSLR; a smartphone with good lighting works wonders. Show the item from multiple angles and include close-ups of important features.</p>

      <h2>2. Price Competitively</h2>
      <p>Research similar items on the platform. Start with a slightly lower price to attract your first few renters and build up reviews. Once you have a 5-star rating, you can gradually increase your rates.</p>

      <h2>3. Respond Quickly</h2>
      <p>Renters often book the first item that gets a response. Turn on notifications and aim to reply to inquiries within an hour. High responsiveness boosts your listing in search results.</p>

      <h2>4. Create Detailed Descriptions</h2>
      <p>Answers potential questions before they are asked. List all features, specifications, and any included accessories. A detailed description builds trust and reduces back-and-forth messaging.</p>

      <h2>5. Offer Delivery</h2>
      <p>Convenience is king. Owners who offer delivery (even for a small fee) see a significant increase in bookings compared to those who only offer pickup.</p>
    `,
        coverImage: "/blog/maximize-income.jpg",
        date: "2025-06-02",
        author: authors.david,
        category: "guides",
        tags: ["Income", "Owners", "Business"],
        readingTime: "4 min read",
    },
    {
        slug: "future-sharing-economy-africa",
        title: "The Future of the Sharing Economy in Africa",
        excerpt: "Why ownership is becoming obsolete and access is the new currency. Analyzing trends in the African rental market.",
        content: `
      <p>The traditional model of "buy, use, store" is being disrupted. Across Africa, a shift towards access over ownership is gaining momentum, driven by technology, sustainability, and economic efficiency.</p>

      <h2>Economic Empowerment</h2>
      <p>The sharing economy allows individuals to monetize assets they already own. In Kenya, this is creating a new class of micro-entrepreneurs who are generating significant income from vehicles, equipment, and real estate.</p>

      <h2>Sustainability</h2>
      <p>Sharing resources reduces the need for mass production and minimizes waste. By renting instead of buying, we are collectively lowering our carbon footprint and promoting a circular economy.</p>

      <h2>Access to High-Quality Goods</h2>
      <p>For many, buying a high-end camera or a luxury car is out of reach. The sharing economy democratizes access, allowing people to use premium products for a fraction of the cost.</p>
    `,
        coverImage: "/blog/sharing-economy.jpg",
        date: "2025-06-20",
        author: authors.sarah,
        category: "Market Insights",
        tags: ["Trends", "Economy", "Africa"],
        readingTime: "6 min read",
    },
    {
        slug: "safety-tips-peer-to-peer-rentals",
        title: "Safety Tips for Peer-to-Peer Rentals",
        excerpt: "Trust is the foundation of our community. Here is how we ensure safety for both owners and renters.",
        content: `
      <p>At Leli Rentals, safety is our top priority. While we have robust verification systems in place, there are steps you can take to ensure a secure experience.</p>

      <h2>For Owners</h2>
      <ul>
        <li><strong>Verify ID:</strong> Always check the renter's physical ID at pickup to ensure it matches their profile.</li>
        <li><strong>Document Condition:</strong> Take photos before and after the rental.</li>
        <li><strong>Trust Your Instincts:</strong> If a request feels off, it's okay to decline.</li>
      </ul>

      <h2>For Renters</h2>
      <ul>
        <li><strong>Meeting Points:</strong> Always meet in public, well-lit areas for pickups and returns.</li>
        <li><strong>Inspect Items:</strong> Don't accept an item that looks unsafe or damaged.</li>
        <li><strong>Report Issues:</strong> If something goes wrong, contact support immediately.</li>
      </ul>
    `,
        coverImage: "/blog/safety-tips.jpg",
        date: "2025-07-05",
        author: authors.leli,
        category: "Safety & Trust",
        tags: ["Safety", "Trust", "Community"],
        readingTime: "3 min read",
    },
    {
        slug: "understanding-rental-insurance",
        title: "Understanding Rental Insurance: A Complete Guide",
        excerpt: "Don't let accidents ruin your day. Everything you need to know about insurance coverage on Leli Rentals.",
        content: `
      <p>Peace of mind is priceless. That's why understanding rental insurance is crucial for both owners and renters. Here is a breakdown of how it works.</p>

      <h2>The Basics</h2>
      <p>Most rentals on our platform come with a basic protection plan. This covers minor damages and disputes. However, for high-value items, additional coverage is recommended.</p>

      <h2>Damage Waiver</h2>
      <p>Renters can purchase a damage waiver for a small daily fee. This reduces or eliminates the deductible in case of accidental damage during the rental period.</p>

      <h2>Liability Coverage</h2>
      <p>Our insurance partners provide liability coverage to protect you in case the rented item causes injury or property damage to a third party.</p>
    `,
        coverImage: "/blog/insurance-guide.jpg",
        date: "2025-07-12",
        author: authors.david,
        category: "Guides",
        tags: ["Insurance", "Protection", "Guide"],
        readingTime: "5 min read",
    },
    {
        slug: "leli-rentals-transforming-market",
        title: "How Leli Rentals is Transforming the Kenyan Rental Market",
        excerpt: "From a simple idea to a nationwide platform. The story of Leli Rentals and our vision for the future.",
        content: `
      <p>What started as a frustration with finding a reliable car rental in Nairobi has grown into Kenya's premier peer-to-peer rental marketplace. Leli Rentals is more than just a platform; it's a movement.</p>

      <h2>Bridging the Gap</h2>
      <p>Before Leli, the rental market was fragmented and opaque. We brought transparency, trust, and convenience to the industry, connecting thousands of owners with renters across the country.</p>

      <h2>Tech-First Approach</h2>
      <p>By leveraging technology, we've made the rental process seamless. From instant bookings to secure payments and digital ID verification, we are setting new standards for efficiency.</p>

      <h2>Community Focus</h2>
      <p>Our community is at the heart of everything we do. We listen to your feedback and constantly evolve to meet your needs. Together, we are building a more connected and sustainable Kenya.</p>
    `,
        coverImage: "/blog/leli-story.jpg",
        date: "2025-08-01",
        author: authors.leli,
        category: "Platform Updates",
        tags: ["Company News", "Vision", "Kenya"],
        readingTime: "4 min read",
        featured: true,
    },
]

export function getPostBySlug(slug: string) {
    return blogPosts.find((post) => post.slug === slug)
}

export function getPostsByCategory(category: string) {
    return blogPosts.filter((post) => post.category.toLowerCase() === category.toLowerCase())
}

export function getRelatedPosts(slug: string, limit = 3) {
    const currentPost = getPostBySlug(slug)
    if (!currentPost) return []

    return blogPosts
        .filter((post) => post.slug !== slug && post.category === currentPost.category)
        .slice(0, limit)
}
export function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}
