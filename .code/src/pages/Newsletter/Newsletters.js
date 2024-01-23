import React, { useState, useEffect } from "react";

const Newsletters = () => {
  const [newsletterData, setNewsletterData] = useState([]);

  useEffect(() => {
    // fetch(`${config.googleAuth.backURL}/rentdigi/newsletter/get`)
    fetch(`http://localhost:9000/newsletters/rentdigi/newsletter/get`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setNewsletterData(data.result);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <h1 className="pl-4 pt-4">Newsletters</h1>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="text-dark">ID</th>
              <th className="text-dark">Email</th>
            </tr>
          </thead>
          <tbody>
            {newsletterData.map((newsletter) => (
              <tr key={newsletter._id}>
                <td>{newsletter._id}</td>
                <td>{newsletter.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Newsletters;
