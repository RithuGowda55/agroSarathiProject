import React from 'react';
import './Tables.css'; // Import CSS for styling

// Helper function to determine row color based on deadline
const getRowColor = (deadlineDate) => {
  const currentDate = new Date();
  const deadline = new Date(deadlineDate);
  const timeDifference = deadline - currentDate; // Difference in milliseconds

  const dayDifference = timeDifference / (1000 * 3600 * 24); // Convert to days

  if (dayDifference <= 7) {
    return 'red'; // Urgent (7 days or less)
  } else if (dayDifference <= 30) {
    return 'yellow'; // Upcoming (8 to 30 days)
  } else {
    return 'green'; // Distant (more than 30 days)
  }
};

export const Tables = ({ schemes }) => {
  return (
    <div>
      {/* Information box for color meanings */}
      <div className="info-box">
        <div className="info-item">
          <span className="color-box red"></span> Urgent (7 days or less)
        </div>
        <div className="info-item">
          <span className="color-box yellow"></span> Upcoming (8 to 30 days)
        </div>
        <div className="info-item">
          <span className="color-box green"></span> Distant (more than 30 days)
        </div>
      </div>
      
      {/* Table displaying schemes */}
      <table>
        <thead>
          <tr>
            <th>Scheme Name</th>
            <th>Description</th>
            <th>State</th>
            <th>Crop Type</th>
            <th>Income Level</th>
            <th>Amount</th>
            <th>Deadline</th>
            <th>Contact</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {schemes.map(scheme => {
            const rowColor = getRowColor(scheme.applicationDeadline); // Get row color based on deadline
            
            return (
              <tr key={scheme._id} className={rowColor}>
                <td>{scheme.schemeName}</td>
                <td>{scheme.description}</td>
                <td>{scheme.state}</td>
                <td>{scheme.cropType}</td>
                <td>{scheme.incomeLevel}</td>
                <td>{scheme.amount}</td>
                <td>{new Date(scheme.applicationDeadline).toLocaleDateString()}</td>
                <td>{scheme.contact}</td>
                <td>
                  {scheme.website ? (
                    <a 
                      href={scheme.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Visit
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
