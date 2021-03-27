import React, { useEffect, useState } from "react";
import americanExpress from "../assets/images/american-express.png";
import discover from "../assets/images/discover.png";
import mastercard from "../assets/images/mastercard.png";
import visa from "../assets/images/visa.png";
import chip from "../assets/images/chip.png";

/* Reference */
/*
  American Express :- Starting with 34 or 37, length 15 digits.
  Visa :- Starting with 4, length 13 or 16 digits.
  MasterCard :- Starting with 51 through 55, length 16 digits.
  Discover :- Starting with 6011, length 16 digits or starting with 5, length 15 digits.
*/
/* End */

const creditCardProvider = [
  {
    bgColor: "#108168",
    icon: americanExpress,
    pattern: /^(?:3[47][0-9]{13})$/,
  },
  {
    bgColor: "#86B8CF",
    icon: discover,
    pattern: /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/,
  },
  {
    bgColor: "#0061A8",
    icon: mastercard,
    pattern: /^(?:5[1-5][0-9]{14})$/,
  },
  {
    bgColor: "#191278",
    icon: visa,
    pattern: /^(?:4[0-9]{12}(?:[0-9]{3})?)$/,
  },
];

const Home = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    console.log("bangsat", data);
  });

  const onChangeInput = (event) => {
    const { value, name } = event.target || {};

    let realValue = value;
    let dataTemp = data;
    let trimmedValue = (realValue || "").trim();

    if (name === "securitycode") {
      realValue = realValue.replace(/./g, "*");
      trimmedValue = `${data?.securitycode?.forImg || ""}${trimmedValue.replace(
        /\*/g,
        ""
      )}`;
    } else if (name === "cardnumber") {
      const cardNumberObj = formatCardNumber(trimmedValue);

      realValue = cardNumberObj.value;
      trimmedValue = cardNumberObj.masked;
      dataTemp =
        creditCardProvider.filter(({ pattern }) =>
          pattern.test(realValue)
        )[0] || {};
    } else if (name === "expiration") {
      realValue = formatDate(realValue);
      trimmedValue = realValue;
    }

    setData({
      ...dataTemp,
      ...{
        [name]: {
          forImg: trimmedValue,
          forInput: realValue,
        },
      },
    });
  };

  const formatDate = (value) => {
    return value
      .replace(
        /[^0-9]/g,
        "" // To allow only numbers
      )
      .replace(
        /^([2-9])$/g,
        "0$1" // To handle 3 > 03
      )
      .replace(
        /^(1{1})([3-9]{1})$/g,
        "0$1/$2" // 13 > 01/3
      )
      .replace(
        /^0{1,}/g,
        "0" // To handle 00 > 0
      )
      .replace(
        /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
        "$1/$2" // To handle 113 > 11/3
      );
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length
      ? {
          masked: parts.join(" "),
          value: match,
        }
      : {
          masked: value,
          value: match,
        };
  };

  return (
    <div className="home-page">
      <div
        className="credit-card-layout"
        style={{ backgroundColor: data.bgColor || "#fff" }}
      >
        <div className="header">
          <img src={chip} />
          <img src={data.icon || ""} />
        </div>

        <div className="card-number">
          <div className="title">card number</div>
          <div className="card-number-masked">
            {data?.cardnumber?.forImg || ""}
          </div>
        </div>

        <div className="cardholder-expiration">
          <div className="cardholder">
            <div className="title">cardholder name</div>
            <div className="cardholder-expiration-masked">
              {data?.cardholder?.forImg || ""}
            </div>
          </div>

          <div className="expiration">
            <div className="title">expiration</div>
            <div className="cardholder-expiration-masked">
              {data?.expiration?.forImg || ""}
            </div>
          </div>
        </div>
      </div>

      <div className="credit-card-form">
        <div className="input-container">
          <label className="input-label">Name</label>
          <input
            className="input-text"
            value={data?.cardholder?.forInput || ""}
            onChange={onChangeInput}
            type="text"
            name="cardholder"
          />
        </div>

        <div className="input-container">
          <label className="input-label">Card Number</label>
          <input
            placeholder="•••• •••• •••• ••••"
            className="input-text"
            value={data?.cardnumber?.forImg || ""}
            onChange={onChangeInput}
            type="text"
            name="cardnumber"
          />
        </div>

        <div className="input-container-group">
          <div className="input-container">
            <label className="input-label">Expiration (mm/yy)</label>
            <input
              className="input-text"
              value={data?.expiration?.forInput || ""}
              onChange={onChangeInput}
              type="text"
              name="expiration"
            />
          </div>

          <div className="input-container">
            <label className="input-label">Security Code</label>
            <input
              className="input-text"
              value={data?.securitycode?.forInput}
              onChange={onChangeInput}
              type="text"
              name="securitycode"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
