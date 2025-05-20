import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    content:
      "I got interviews from 3 out of 5 applications in a single week after using CoverSumé. The AI perfectly matched my experience to the job requirements.",
    author: "Sarah Johnson",
    title: "Software Engineer",
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&h=150",
  },
  {
    id: 2,
    content:
      "As a recent graduate, I was struggling to make my limited experience sound relevant. CoverSumé helped me highlight my transferable skills perfectly.",
    author: "Michael Chen",
    title: "Marketing Analyst",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=150",
  },
  {
    id: 3,
    content:
      "The Harvard-style formatting gives my applications a professional edge. My career counselor was impressed with the quality of my cover letters.",
    author: "Emily Rodriguez",
    title: "Project Manager",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&h=150",
  },
  {
    id: 4,
    content:
      "I got interviews from 3 out of 5 applications using CoverSumé cover letters. The personalization was exactly what I needed.",
    author: "Sarah T.",
    title: "Marketing Professional",
    rating: 5,
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=150",
  },
  {
    id: 5,
    content:
      "As a recent grad, I had no idea how to write a good cover letter. This tool made it so easy, and I landed my first job!",
    author: "James K.",
    title: "Computer Science Graduate",
    rating: 5,
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&h=150",
  },
  {
    id: 6,
    content:
      "The Harvard-style format is elegant and professional. I've recommended this to everyone in my job search group.",
    author: "Michelle L.",
    title: "Project Manager",
    rating: 4,
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&h=150",
  },
];

const Testimonials: React.FC = () => {
  const carouselTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];
  return (
    <section className="py-16 sm:py-24">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of job seekers who have successfully landed
            interviews with our cover letters.
          </p>
        </div>

        <div className="w-full overflow-x-auto pb-6 pt-1">
          <ul className="flex animate-carousel gap-4">
            {carouselTestimonials.map((testimonial, i) => (
              <li
                key={`${testimonial.id}${i}`}
                className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
              >
                <motion.div
                  key={testimonial.id}
                  className="card overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="p-6 sm:p-8 h-[300px] md:h-[250px] flex flex-col">
                    <Quote className="h-8 w-8 text-primary-300 mb-4" />
                    <p className="text-gray-700 mb-6 flex-grow">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div className="flex items-center">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        // fill
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {testimonial.author}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-6 sm:p-8 h-full flex flex-col">
                <Quote className="h-8 w-8 text-primary-300 mb-4" />
                <p className="text-gray-700 mb-6 flex-grow">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default Testimonials;
