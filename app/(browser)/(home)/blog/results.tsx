import Image from "next/image";
import React from "react";

const ResultsBlog = () => {
  const blogs = [
    {
      title: "Cara Memilih Sepatu untuk Aktivitas Outdoor",
      desc: "Temukan tips memilih sepatu yang nyaman dan tahan lama untuk kegiatan luar ruangan.",
      img: "/images/outdoor1.jpg",
      link: "#",
    },
    {
      title: "Trend Sneakers 2025",
      desc: "Sneakers terbaru yang akan populer tahun ini. Dari warna cerah hingga desain minimalis.",
      img: "/images/trends1.jpg",
      link: "#",
    },
    {
      title: "Merawat Sepatu Agar Awet",
      desc: "Tips dan trik merawat sepatu favoritmu agar tetap terlihat seperti baru.",
      img: "/images/cuci1.jpg",
      link: "#",
    },
  ];
  return (
    <section className="w-full mt-16">
      <div className="text-center">
        <h2 className="font-semibold tracking-wide text-2xl">
          Latest from Our Blog
        </h2>
        <p className="text-sm text-muted-foreground">
          Tips, trend, and inspiration fashion for you.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <article
            key={blog.title}
            className="bg-background dark:bg-primary-foreground rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative w-full aspect-[16/9] bg-neutral-200/30 dark:bg-black/30">
              <Image
                src={blog.img}
                alt={blog.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain"
              />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg">{blog.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {blog.desc}
              </p>
              <a
                href={blog.link}
                className="inline-block mt-4 text-blue-600 font-medium hover:underline"
              >
                Read More →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ResultsBlog;
