const events = [
  // {
  //   id: 1,
  //   title: "Hey!",
  //   start: new Date().setDate(new Date().getDate() + 1),
  //   className: "bg-warning text-white",
  // },
  {
    id: 2,
    title: "Ticket 1",
    start: new Date(),
    end: new Date(),
    className: "bg-soft-success text-success",
  },
  {
    id: 3,
    title: "Appointment 1",
    start: new Date().setDate(new Date().getDate() + 8),
    className: "bg-soft-warning text-warning",
  },
  {
    id: 4,
    title: "Task",
    start: new Date().setDate(new Date().getDate() + 7),
    className: "bg-soft-danger text-danger",
  },
]

const calenderDefaultCategories = [
  {
    id: 1,
    title: "Ticket",
    type: "bg-soft-success",
    text: "text-success"
  },
  // {
  //   id: 2,
  //   title: "Meeting",
  //   type: "bg-soft-info",
  //   text: "text-info"
  // },
  {
    id: 3,
    title: "Appointment",
    type: "bg-soft-warning",
    text: "text-warning"
  },
  {
    id: 4,
    title: "Task",
    type: "bg-soft-danger",
    text: "text-danger"
  },
  // {
  //   id: 5,
  //   title: "Team Meeting",
  //   type: "bg-soft-dark",
  //   text: "text-dark"
  // },
]

export { calenderDefaultCategories, events }
