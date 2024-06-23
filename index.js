const { useState, createContext, useContext,useEffect } = React;


// Funciones
const modifyTime = (type, prevState) => {
  if (prevState === 1 && type === "take") {
    return prevState;
  } else if (type === "add") {
    return prevState + 1;
  } else if (type === "take") {
    return prevState - 1;
  }
  return prevState;
};

const restart = () => {
  return 25;
};

// Context
const CountContext = createContext();
const useCount = () => useContext(CountContext);

const CountProvider = ({ children }) => {
  const [count, setCount] = useState({ duty: 25, break: 5 });

  return (
    <CountContext.Provider value={{ count, setCount }}>
      {children}
    </CountContext.Provider>
  );
};

// Componentes
const ToDoTime = () => {
  const { count, setCount } = useCount();
  const setter = (type) => {
    setCount((prevCount) => ({
      ...prevCount,
      duty: modifyTime(type, prevCount.duty),
    }));
  };

  return (
    <>
      <h2>Session length</h2>
      <button onMouseDown={() => setter("add")}>+</button>
      <p>{count.duty}</p>
      <button onMouseDown={() => setter("take")}>-</button>
    </>
  );
};

const Break = () => {
  const { count, setCount } = useCount();
  const setter = (type) => {
    setCount((prevCount) => ({
      ...prevCount,
      break: modifyTime(type, prevCount.break),
    }));
  };

  return (
    <>
      <h2>Break length</h2>
      <button onMouseDown={() => setter("add")}>+</button>
      <p>{count.break}</p>
      <button onMouseDown={() => setter("take")}>-</button>
    </>
  );
};

const Display = () => {
  const { count } = useCount();
  const [leftTime, setLeftTime] = useState(count.duty * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  
  useEffect(()=> {
    if(!isRunning && !isBreak){
      setLeftTime(count.duty * 60)
    }
  } ,[count.duty])
  
  useEffect(()=>{
    let timer;
    if(isRunning){
      timer = setInterval(() => {
        setLeftTime((prev) => {
          if(prev > 0) return prev - 1;
          clearInterval(timer);
          sound();
          if(!isBreak){
            setTimeOut(()=> {
            setLeftTime(count.break * 60);
            setIsBreak(true);
            setIsRunning(true);   
            }, 2000)
          }
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, isBreak, count.break])
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  return (
    <div className="display">
      <p class="leftTime">{formatTime(leftTime)}</p>
      <button onClick={()=>{
          setIsRunning(prev => !prev)
        }} class="playStop" ></button>
    </div>
  );
};

const App = () => {
  return (
    <CountProvider>
      <div className="maestro">
        <h1 className="titulo">25 + 5 Clock</h1>
        <div className="counters">
          <div className="counter">
            <ToDoTime />
          </div>
          <div className="counter">
            <Break />
          </div>
        </div>
        <Display />
      </div>
    </CountProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));