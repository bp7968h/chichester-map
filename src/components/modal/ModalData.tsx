const ModalData = {
    title: "What is This Broo!!",
    descsriptin: (<>Need to add desc</>),
    details: [
      {
        title: "🔧 How does this work?",
        content: (
          <>
            <p>
              Need to add
            </p>
          </>
        ),
      },
        {
          title: "🚀 What are the supported features?",
          content: (
            <>
              <p>
              Need to add
            </p>
            </>
          ),
        },
        {
          title: "❌ What is not supported yet?",
          content: (
            <>
              <p>
              Need to add
            </p>
            </>
          ),
        },
        {
          title: "🌍 Why is this an SSR site?",
          content: (
            <p className="text-gray-300">
              I don’t have a backend server, so this is a general
              server-side rendered (SSR) site hosted on **GitHub Pages**.
            </p>
          ),
        },
        {
          title: "📂 Where is the code?",
          content: (
            <>
            <p>You can find all the code for this project in the below github repository</p>
            <ul className="list-disc list-inside text-gray-300">
              <li>
                <a
                  href="https://github.com/bp7968h/chichester-map"
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chichester Map
                </a>
              </li>
            </ul>
            </>
          ),
        },
        {
          title: "🙏 Acknowledgements",
          content: (
            <ul className="list-disc list-inside text-gray-300">
              
              <li>📝 Let me think</li>
            </ul>
          ),
        },
      ],
};

export default ModalData;