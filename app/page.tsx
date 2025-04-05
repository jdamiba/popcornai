"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Define the movie type
interface Movie {
  id: number;
  title: string;
  imagePath: string;
}

export default function Home() {
  // State to store all movie images with proper typing
  const [movieImages, setMovieImages] = useState<Movie[]>([]);

  // Load all movie images on component mount
  useEffect(() => {
    // This would typically be an API call to get the list of images
    // For now, we'll use a static list based on what we found in the directory
    const allMovies: Movie[] = [
      {
        id: 1,
        title: "Matrix",
        imagePath:
          "/movies/Matrix.mpw.102176_bb2f6cc5-4a16-4512-881b-f855ead3c8ec_240x360_crop_center.progressive.avif",
      },
      {
        id: 2,
        title: "Goodfellas",
        imagePath:
          "/movies/Goodfellas.mpw.116119_240x360_crop_center.progressive.avif",
      },
      {
        id: 3,
        title: "Movie 3",
        imagePath:
          "/movies/f0cd5f2e44335f50a514c295c237bd01_f31ed5e8-6db5-4824-8c6c-540b95310681_240x360_crop_center.progressive.avif",
      },
      {
        id: 4,
        title: "Inglourious Basterds",
        imagePath:
          "/movies/inglourious-basterds-style4_37d01d94-318d-4840-a290-6fc5aa7b8072_240x360_crop_center.progressive.webp",
      },
      {
        id: 5,
        title: "Halloween",
        imagePath:
          "/movies/halloween.mpw.mp_240x360_crop_center.progressive.avif",
      },
      {
        id: 6,
        title: "Jurassic Park",
        imagePath: "/movies/jurassicpark.mpw_500x749.webp",
      },
      {
        id: 7,
        title: "Interstellar",
        imagePath: "/movies/interstellar-139400_500x749.webp",
      },
      {
        id: 8,
        title: "Deadpool & Wolverine",
        imagePath:
          "/movies/deadpool-wolverine_866a70e7-fb48-4f35-a44b-41594691ac76_500x749.webp",
      },
      {
        id: 9,
        title: "The Dark Knight",
        imagePath:
          "/movies/darkknight.building.24x36_20e90057-f673-4cc3-9ce7-7b0d3eeb7d83_500x749.webp",
      },
      {
        id: 10,
        title: "Back to the Future",
        imagePath: "/movies/backtofuture.mpw_500x749.webp",
      },
      {
        id: 11,
        title: "Movie 11",
        imagePath:
          "/movies/b8d5650e74e9a310c758aac692088feb_69145935-6450-4b65-8107-0224e8342221_500x749.webp",
      },
      {
        id: 12,
        title: "Avengers",
        imagePath: "/movies/avengers.24x36_500x749.webp",
      },
      {
        id: 13,
        title: "Alien",
        imagePath: "/movies/Alien.mpw.114883_500x749.webp",
      },
      {
        id: 14,
        title: "Movie 14",
        imagePath:
          "/movies/6cd691e19fffbe57b353cb120deaeb8f_8489d7bf-24ba-4848-9d0f-11f20cb35025_500x749.webp",
      },
    ];

    setMovieImages(allMovies);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center">
        {/* Movie Posters Carousel */}
        <div className="w-full h-[300px] overflow-hidden bg-gradient-to-br from-blue-900/50 via-gray-900/60 to-black/50">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 overflow-hidden">
              <div className="flex animate-carousel">
                {/* First set of posters */}
                {movieImages.map((movie) => (
                  <div
                    key={`${movie.id}-1`}
                    className="relative w-[200px] h-[300px] flex-shrink-0 mx-4 rounded-lg overflow-hidden border border-gray-700 shadow-lg"
                  >
                    <Image
                      src={movie.imagePath}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="200px"
                      priority
                    />
                  </div>
                ))}

                {/* Duplicate set for seamless loop */}
                {movieImages.map((movie) => (
                  <div
                    key={`${movie.id}-2`}
                    className="relative w-[200px] h-[300px] flex-shrink-0 mx-4 rounded-lg overflow-hidden border border-gray-700 shadow-lg"
                  >
                    <Image
                      src={movie.imagePath}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="200px"
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="w-full py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Popcorn.AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Break out of your movie rut with AI-powered recommendations based
              on your professional journey
            </p>
            <Link
              href="/search"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Discover Something New
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section 1 */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-white mb-6">
                AI-Powered Vector Search
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Our advanced vector search technology analyzes your resume to
                understand your professional experience, skills, and
                achievements. By converting text into high-dimensional vectors,
                we can find movies that resonate with your career journey in
                ways that simple keyword matching can't.
              </p>
              <Link
                href="/search"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Try It Now
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-900 to-gray-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/ai.jpg"
                    alt="An abstract image of a computer screen with a vector search algorithm"
                    fill
                    className="object-cover"
                    sizes="200px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 to-gray-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/popcorn.jpg"
                    alt="An image of popcorn in a bag"
                    fill
                    className="object-cover"
                    sizes="200px"
                    priority
                  />{" "}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Personalized Movie Adventures
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Our vector search technology finds movies that align with your
                professional journey while introducing unexpected elements. It's
                like having a friend who knows exactly what you need to watch
                next based on your career experiences.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">✓</span>
                  Discover movies that match your career themes
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">✓</span>
                  Explore genres you might not have considered
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">✓</span>
                  Find your next favorite based on your professional journey
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Paste Your Resume
              </h3>
              <p className="text-gray-300">
                Simply copy and paste your resume text into our search box. Our
                AI will analyze your professional experience and skills.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Vector Search Magic
              </h3>
              <p className="text-gray-300">
                Our technology converts your resume into a semantic vector
                representation, understanding the context and meaning of your
                experience to find relevant movies.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Discover & Enjoy
              </h3>
              <p className="text-gray-300">
                Get personalized movie recommendations that align with your
                professional journey, complete with explanations of why they
                match your experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Break Out of Your Movie Rut?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals discovering movies that match their
            career journey
          </p>
          <Link
            href="/search"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Start Your Adventure
          </Link>
        </div>
      </section>
    </main>
  );
}
