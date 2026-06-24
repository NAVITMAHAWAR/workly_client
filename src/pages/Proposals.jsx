import { Star, Eye } from "lucide-react";

export default function Proposals() {
  const proposals = [
    {
      id: 1,
      freelancer: "Rahul Sharma",
      rating: 4.9,
      bidAmount: 800,
      deliveryTime: "5 Days",
      coverLetter:
        "I have 3 years experience in React and Node.js development.",
    },
    {
      id: 2,
      freelancer: "Amit Verma",
      rating: 4.8,
      bidAmount: 950,
      deliveryTime: "7 Days",
      coverLetter:
        "I can build a clean and scalable dashboard for your project.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Received Proposals</h1>

        <div className="space-y-5">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    {proposal.freelancer}
                  </h2>

                  <div className="flex items-center gap-1 mt-2">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {proposal.rating}
                  </div>

                  <p className="mt-3 text-gray-600">{proposal.coverLetter}</p>

                  <div className="mt-4 flex gap-6">
                    <span>
                      <strong>Bid:</strong> ₹{proposal.bidAmount}
                    </span>

                    <span>
                      <strong>Delivery:</strong> {proposal.deliveryTime}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-100">
                    <Eye size={18} />
                    View
                  </button>

                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Hire Freelancer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
