import {
  Search,
  Code,
  PenTool,
  Video,
  Palette,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const categories = [
    { name: "Web Development", icon: <Code size={30} /> },
    { name: "UI/UX Design", icon: <Palette size={30} /> },
    { name: "Content Writing", icon: <PenTool size={30} /> },
    { name: "Video Editing", icon: <Video size={30} /> },
  ];

  const freelancers = [
    {
      name: "Narendra Mahawar",
      skill: "MERN Stack Developer",
      rate: "₹800/hr",
      rating: "4.9",
    },
    {
      name: "Rahul Sharma",
      skill: "UI/UX Designer",
      rate: "₹600/hr",
      rating: "4.8",
    },
    {
      name: "Amit Verma",
      skill: "Frontend Developer",
      rate: "₹700/hr",
      rating: "4.7",
    },
  ];

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Hire Expert Freelancers For Any Project
            </h1>

            <p className="mt-6 text-lg text-gray-100">
              Find talented developers, designers, writers and marketers to grow
              your business faster.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold">
                Hire Talent
              </button>

              <button className="border border-white px-6 py-3 rounded-xl font-semibold">
                <Link to="/PostJob">Post a Job</Link>
              </button>
            </div>

            <div className="mt-8 relative max-w-xl">
              <Search
                className="absolute left-4 top-3.5 text-gray-500"
                size={20}
              />

              <input
                type="text"
                placeholder="Search freelancers, skills, services..."
                className="w-full py-3 pl-12 pr-4 rounded-xl text-black bg-white"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 text-black shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Top Rated Freelancer</h3>

            <div className="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/150?img=5"
                alt=""
                className="w-16 h-16 rounded-full"
              />

              <div>
                <h4 className="font-bold">Narendra Mahawar</h4>
                <p className="text-gray-500">MERN Stack Developer</p>
                <p className="text-yellow-500">⭐ 4.9</p>
              </div>
            </div>

            <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl">
              View Profile
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Popular Categories
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition"
            >
              <div className="text-indigo-600 mb-4">{item.icon}</div>

              <h3 className="font-semibold text-lg">{item.name}</h3>

              <p className="text-gray-500 mt-2">250+ Freelancers</p>
            </div>
          ))}
        </div>
      </section>

      {/* Freelancers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Top Freelancers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((item, index) => (
              <div
                key={index}
                className="border rounded-2xl p-6 hover:shadow-xl transition"
              >
                <img
                  src={`https://i.pravatar.cc/150?img=${index + 10}`}
                  alt=""
                  className="w-20 h-20 rounded-full mx-auto"
                />

                <h3 className="text-center font-bold mt-4">{item.name}</h3>

                <p className="text-center text-gray-500">{item.skill}</p>

                <div className="flex justify-between mt-4">
                  <span>⭐ {item.rating}</span>
                  <span>{item.rate}</span>
                </div>

                <button className="w-full mt-5 bg-indigo-600 text-white py-3 rounded-xl">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            How Workly Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              "Post a Job",
              "Receive Proposals",
              "Hire Freelancer",
              "Get Work Done",
            ].map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl text-center">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {index + 1}
                </div>

                <h3 className="font-semibold">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <h2 className="text-5xl font-bold">Ready To Start Your Project?</h2>

        <p className="mt-4 text-lg">
          Join thousands of clients and freelancers today.
        </p>

        <button className="mt-8 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2">
          Get Started
          <ArrowRight size={20} />
        </button>
      </section>
    </div>
  );
}
