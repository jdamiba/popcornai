"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Popcorn.AI</h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover movies that match your professional journey using
            AI-powered vector search
          </p>
          <Link
            href="/search"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Finding Movies
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">AI-Powered Matching</h3>
            <p className="text-gray-300">
              Our advanced vector search technology analyzes your resume to
              understand your professional experience, skills, and achievements.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              Smart Movie Discovery
            </h3>
            <p className="text-gray-300">
              Find movies that resonate with your career path, whether it's
              about leadership, innovation, or specific industries you've worked
              in.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              Comprehensive Results
            </h3>
            <p className="text-gray-300">
              Get detailed movie information including ratings, genres, and plot
              summaries to help you make informed choices.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Paste Your Resume
                </h3>
                <p className="text-gray-300">
                  Simply copy and paste your resume text into our search box.
                  Our AI will analyze your professional experience and skills.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                <p className="text-gray-300">
                  Our vector search technology converts your resume into a
                  semantic representation, understanding the context and meaning
                  of your experience.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Get Movie Recommendations
                </h3>
                <p className="text-gray-300">
                  Receive personalized movie recommendations that align with
                  your professional journey, complete with similarity scores and
                  detailed information.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-300 mb-4">
            Ready to discover movies that match your career?
          </p>
          <Link
            href="/search"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try It Now
          </Link>
        </div>
      </div>
    </main>
  );
}
