import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { LoadingComponent } from "../../../../components";
import customStyles from "./ContractRead.module.css";

// class ContractRead extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       params: {}
//     };
//   }

//   handleChange = e => {
//     const { name, value } = e.target;
//     this.setState({
//       params: {
//         ...this.state.params,
//         [name]: value
//       }
//     });
//   };

//   handleClick = (address, method, inputs, index) => {
//     console.log(address, "params address");
//     const params = this.makeParams(method, inputs);
//     this.props.icxCall({
//       address,
//       method,
//       params,
//       index
//     });
//   };

//   makeParams = (funcName, inputs) => {
//     const { params } = this.state;
//     const result = {};
//     inputs.forEach(item => {
//       const name = item["name"];
//       const type = item["type"];
//       const inputName = `${funcName}_${name}_${type}`;
//       const value = params[inputName] || "";
//       result[name] = value;
//     });
//     return result;
//   };

//   render() {
//     const { params } = this.state;
//     const { contract, contractReadInfo } = this.props;
//     const { data } = contract;
//     const { address: address } = data;
//     const { loading, funcList, funcOutputs, error } = contractReadInfo;

//     return (
//       <div className="contents">
//         <div className="code-box read">
//           <div className="title-group">
//             <span className="title">Read contract information</span>
//           </div>
//           {loading ? (
//             <LoadingComponent height="322px" />
//           ) : (
//             <div className="scroll">
//               <ul className="list">
//                 {!!error ? (
//                   <li>{error}</li>
//                 ) : (
//                   funcList.map((func, index) => {
//                     const outputs = funcOutputs[index];
//                     const inputs = func["inputs"];
//                     const isQuery = inputs.length > 0;
//                     if (isQuery) {
//                       const funcName = func["name"];
//                       return [
//                         <li key="li0" className="input">
//                           <span className="label">
//                             {index + 1}. {funcName} >{" "}
//                           </span>
//                           {
//                             <Inputs
//                               inputs={inputs}
//                               params={params}
//                               handleChange={this.handleChange}
//                               funcName={funcName}
//                             />
//                           }
//                           <button
//                             key="button"
//                             className="btn-type-query"
//                             onClick={() => {
//                               this.handleClick(
//                                 address,
//                                 funcName,
//                                 inputs,
//                                 index
//                               );
//                             }}
//                           >
//                             Query
//                           </button>
//                         </li>,
//                         <li key="li1" className="result">
//                           <OutputTypes func={func} />
//                           {!isEmptyOutput(outputs) && (
//                             <OutputResults func={func} outputs={outputs} />
//                           )}
//                         </li>
//                       ];
//                     } else {
//                       return (
//                         <Outputs
//                           key={index}
//                           func={func}
//                           outputs={outputs}
//                           index={index}
//                         />
//                       );
//                     }
//                   })
//                 )}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }
// }

function ContractRead({ contract, contractReadInfo, icxCall }) {
  const [params, setParams] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setParams({
      ...params,
      [name]: value
    });
  };

  const handleClick = (address, method, inputs, index) => {
    console.log(address, "params address");
    const paramsData = makeParams(method, inputs);
    icxCall({
      address,
      method,
      params: paramsData,
      index
    });
  };

  const makeParams = (funcName, inputs) => {
    const result = {};
    inputs.forEach(item => {
      const name = item["name"];
      const type = item["type"];
      const inputName = `${funcName}_${name}_${type}`;
      const value = params[inputName] || "";
      result[name] = value;
    });
    return result;
  };

  const { data } = contract;
  const { address } = data;
  const { loading, funcList, funcOutputs, error } = contractReadInfo;

  return (
    <div className="contents">
      <div className="code-box read">
        <div className="title-group">
          <span className="title">Read contract information</span>
        </div>
        {loading ? (
          <LoadingComponent height="322px" />
        ) : (
          <div className="scroll">
            {!!error ? (
              <ul className="list">
                <li>{error}</li>
              </ul>
            ) : (
              <MethodItems
                funcList={funcList}
                funcOutputs={funcOutputs}
                params={params}
                handleChange={handleChange}
                handleClick={handleClick}
                address={address}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MethodItems({
  funcList,
  funcOutputs,
  params,
  handleChange,
  handleClick,
  address
}) {
  return (
    <ul className="list">
      {funcList.map((func, index) => {
        return (
          <div key={`MethodItem-${index}`}>
            <MethodItem
              func={func}
              index={index}
              funcOutputs={funcOutputs}
              params={params}
              handleChange={handleChange}
              handleClick={handleClick}
              address={address}
            />
          </div>
        );
      })}
    </ul>
  );
}

function MethodItem({
  func,
  index,
  funcOutputs,
  params,
  handleChange,
  handleClick,
  address
}) {
  const outputs = funcOutputs[index];
  const inputs = func["inputs"];
  const isQuery = inputs.length > 0;
  const funcName = func["name"];
  return isQuery ? (
    <>
      <li key="li0" className="input">
        <span className="label">
          {index + 1}. {funcName} >{" "}
        </span>
        <Inputs
          inputs={inputs}
          params={params}
          handleChange={handleChange}
          funcName={funcName}
        />
        <button
          key="button"
          className="btn-type-query"
          onClick={() => {
            handleClick(address, funcName, inputs, index);
          }}
        >
          Query
        </button>
      </li>
      ,
      <li key="li1" className="result">
        <OutputTypes func={func} />
        {!isEmptyOutput(outputs) && (
          <OutputResults func={func} outputs={outputs} />
        )}
      </li>
    </>
  ) : (
    <Outputs key={index} func={func} outputs={outputs} index={index} />
  );
}

function isEmptyOutput(outputs) {
  if (!outputs) {
    return true;
  } else {
    const { valueArray, error } = outputs;
    return valueArray.length === 0 && !error;
  }
}

function getOutValue(type, value) {
  switch (type) {
    case "int":
      return new BigNumber(value).toString(10);
    case "str":
      return value;
    default:
      return JSON.stringify(value);
  }
}

function InputItem({ funcName, inputs, params, handleChange, item, index }) {
  const name = item["name"];
  const type = item["type"];
  const inputName = `${funcName}_${name}_${type}`;
  const placeholder = `${name} (${type})`;
  const value = params[inputName] || "";
  return (
    <input
      type="text"
      className="over"
      key={index}
      name={inputName}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
}

function Inputs({ funcName, inputs, params, handleChange }) {
  return inputs.map((item, index) => {
    return (
      <span key={`Inputs-${index}`}>
        <InputItem
          funcName={funcName}
          inputs={inputs}
          params={params}
          handleChange={handleChange}
          item={item}
          index={index}
        />
      </span>
    );
  });
}

function OutputTypes({ func }) {
  const list = func["outputs"];
  return list.map((output, index) => {
    const type = output["type"];
    return (
      <p key={index}>
        ┗<em key={index}>{type}</em>
      </p>
    );
  });
}

function OutputResults({ func, outputs }) {
  const name = func["name"];
  const { valueArray, error } = outputs;
  return (
    <div>
      <p>[ {name} method response ]</p>
      {error ? (
        <p className="red">>> {error}</p>
      ) : (
        valueArray.map((value, i) => {
          const outType = func["outputs"][i]["type"];
          const outValue = getOutValue(outType, value);
          return (
            <p key={i}>
              >><em>{outType}</em>: {outValue}
            </p>
          );
        })
      )}
    </div>
  );
}

function Outputs({ func, outputs, index }) {
  const { valueArray, error } = outputs;
  if (error) {
    return (
      <li key={index}>
        {index + 1}. {func["name"]} > <span>{error}</span>
      </li>
    );
  } else {
    return (
      <li key={index}>
        {index + 1}. {func["name"]} >{" "}
        {valueArray.map((value, i) => {
          const outType = func["outputs"][i]["type"];
          const outValue = getOutValue(outType, value);
          return [
            <span key="span">{outValue}</span>,
            <em key="em">{outType}</em>
          ];
        })}
      </li>
    );
  }
}

export default ContractRead;
