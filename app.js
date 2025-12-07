// portfolio-frontend/app.js
const { useState, useEffect } = React;
const API_URL = 'https://cms-backend-po4n.onrender.com';

function Nav({ current, setCurrent }) {
  const items = ['Home', 'About', 'Skills', 'Projects', 'Blogs', 'Experience', 'Testimonials', 'Services', 'Contact'];
  return (
    React.createElement("nav", { className: "bg-blue-700 text-white px-4 py-3 flex justify-between" },
      React.createElement("div", { className: "font-bold" }, "My Portfolio"),
      React.createElement("div", { className: "space-x-3 text-sm" },
        items.map(item =>
          React.createElement("button", {
            key: item,
            onClick: () => setCurrent(item),
            className: "hover:underline " + (current === item ? "font-semibold" : "")
          }, item)
        )
      )
    )
  );
}

function Home() {
  return (
    React.createElement("section", { className: "p-4" },
      React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Welcome"),
      React.createElement("p", null, "This is my portfolio website. All content is coming from my own custom CMS.")
    )
  );
}

function About() {
  const [about, setAbout] = useState(null);
  useEffect(() => {
    fetch(API_URL + '/content/about')
      .then(r => r.json())
      .then(setAbout);
  }, []);
  if (!about) return React.createElement("p", { className: "p-4" }, "Loading...");
  return (
    React.createElement("section", { className: "p-4" },
      React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "About Me"),
      React.createElement("h2", { className: "text-xl" }, about.name),
      React.createElement("p", { className: "italic mb-2" }, about.title),
      React.createElement("p", null, about.description)
    )
  );
}

function Skills() {
  const [skills, setSkills] = useState([]);
  useEffect(() => {
    fetch(API_URL + '/content/skills')
      .then(r => r.json())
      .then(setSkills);
  }, []);
  return (
    React.createElement("section", { className: "p-4" },
      React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Skills"),
      React.createElement("ul", { className: "list-disc ml-5" },
        skills.map(s =>
          React.createElement("li", { key: s.id }, s.name, " - ", s.level)
        )
      )
    )
  );
}

function SimpleList({ path, title }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(API_URL + '/content/' + path)
      .then(r => r.json())
      .then(setItems);
  }, [path]);
  return (
    React.createElement("section", { className: "p-4" },
      React.createElement("h1", { className: "text-2xl font-bold mb-2" }, title),
      items.length === 0 && React.createElement("p", null, "No items yet."),
      items.map(i =>
        React.createElement("div", { key: i.id, className: "border p-3 mb-2 bg-white" },
          React.createElement("h3", { className: "font-semibold" }, i.title || i.name),
          i.description && React.createElement("p", null, i.description)
        )
      )
    )
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch(API_URL + '/content/projects')
      .then(r => r.json())
      .then(setProjects);
  }, []);
  return (
    React.createElement("section", { className: "p-4" },
      React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Projects"),
      projects.map(p =>
        React.createElement("div", { key: p.id, className: "border p-3 mb-2 bg-white" },
          React.createElement("h3", { className: "font-semibold" }, p.title),
          React.createElement("p", null, p.description),
          p.techStack && React.createElement("p", { className: "text-sm text-gray-600" }, "Tech: ", p.techStack),
          p.link && React.createElement("a", { href: p.link, target: "_blank", className: "text-blue-700 text-sm" }, "View project")
        )
      )
    )
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('');
    try {
      const res = await fetch(API_URL + '/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('Message sent!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('Error sending message');
    }
  }
  return (
    React.createElement("section", { className: "p-4" },
      React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Contact"),
      React.createElement("form", { onSubmit: handleSubmit, className: "max-w-md" },
        React.createElement("input", {
          className: "border p-2 w-full mb-2",
          placeholder: "Name",
          value: form.name,
          onChange: e => setForm({ ...form, name: e.target.value })
        }),
        React.createElement("input", {
          className: "border p-2 w-full mb-2",
          placeholder: "Email",
          value: form.email,
          onChange: e => setForm({ ...form, email: e.target.value })
        }),
        React.createElement("textarea", {
          className: "border p-2 w-full mb-2",
          placeholder: "Message",
          value: form.message,
          onChange: e => setForm({ ...form, message: e.target.value })
        }),
        React.createElement("button", { className: "bg-blue-700 text-white px-4 py-2" }, "Send")
      ),
      status && React.createElement("p", { className: "mt-2" }, status)
    )
  );
}

function App() {
  const [current, setCurrent] = useState('Home');

  let content = null;
  if (current === 'Home') content = React.createElement(Home);
  else if (current === 'About') content = React.createElement(About);
  else if (current === 'Skills') content = React.createElement(Skills);
  else if (current === 'Projects') content = React.createElement(Projects);
  else if (current === 'Blogs') content = React.createElement(SimpleList, { path: "blogs", title: "Blogs" });
  else if (current === 'Experience') content = React.createElement(SimpleList, { path: "experience", title: "Experience" });
  else if (current === 'Testimonials') content = React.createElement(SimpleList, { path: "testimonials", title: "Testimonials" });
  else if (current === 'Services') content = React.createElement(SimpleList, { path: "services", title: "Services" });
  else if (current === 'Contact') content = React.createElement(Contact);

  return (
    React.createElement("div", null,
      React.createElement(Nav, { current, setCurrent }),
      React.createElement("main", { className: "max-w-3xl mx-auto mt-4" }, content)
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(App)
);
