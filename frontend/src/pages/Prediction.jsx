import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";

import '../styles/pages/Prediction.css';
import stocksData from '../data/stocks'; 

// Apply themes
am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

function Prediction() {
  const [query, setQuery] = useState("");
  const [symbol, setSymbol] = useState("SUZLON"); 
  const [exchange, setExchange] = useState("NSE"); 
  const [suggestions, setSuggestions] = useState([]); 
  
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const chartDiv = useRef(null);
  const chartInstance = useRef(null);

  // Check login status
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  // Filter suggestions
  useEffect(() => {
    if (query.length > 0) {
      const filtered = stocksData.filter(stock => 
        stock.name.toLowerCase().includes(query.toLowerCase()) || 
        stock.slug.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 10)); 
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const selectStock = (stock) => {
    setSymbol(stock.slug);
    setExchange(stock.se);
    setQuery(`${stock.name} (${stock.slug})`); 
    setSuggestions([]); 
  };

  const fetchPrediction = async () => {
    if (!query) return; 
    setLoading(true);
    setError(null);
    setStockData([]);

    // Clear previous chart to prevent glitches
    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/search/${exchange}/${symbol}/`);
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setStockData(response.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // Chart Rendering Logic
  useLayoutEffect(() => {
    if (!isLoggedIn || stockData.length === 0 || !chartDiv.current) return;

    // Create chart instance
    let chart = am4core.create(chartDiv.current, am4charts.XYChart);
    chart.padding(20, 20, 20, 20);
    chart.data = stockData;

    // 1. Date Axis
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.strokeOpacity = 0.05;
    dateAxis.renderer.grid.template.stroke = am4core.color("#ffffff");
    dateAxis.renderer.labels.template.fill = am4core.color("#a0a0a0");
    dateAxis.tooltip.background.fill = am4core.color("#4facfe");
    dateAxis.tooltip.background.strokeWidth = 0;
    dateAxis.groupData = true;

    // 2. Value Axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeOpacity = 0.05;
    valueAxis.renderer.grid.template.stroke = am4core.color("#ffffff");
    valueAxis.renderer.labels.template.fill = am4core.color("#a0a0a0");
    valueAxis.tooltip.disabled = true;

    // 3. Line Series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "Date";
    series.dataFields.valueY = "Close";
    series.tooltipText = "[bold]{dateX.formatDate('MMM dd, yyyy')}[/]\nPrice: [bold]₹{valueY.value.formatNumber('#,###.00')}[/]";
    series.strokeWidth = 3;
    series.stroke = am4core.color("#4facfe");
    series.fillOpacity = 0.2;
    
    // Gradient fill
    let gradient = new am4core.LinearGradient();
    gradient.addColor(am4core.color("#4facfe"));
    gradient.addColor(am4core.color("#1e1e2e"));
    gradient.rotation = 90;
    series.fill = gradient;

    // 4. Scrollbar Styling
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series);
    chart.scrollbarX.background.fill = am4core.color("#1e1e2e");
    chart.scrollbarX.background.fillOpacity = 0.5;
    chart.scrollbarX.thumb.background.fill = am4core.color("#ffffff");
    chart.scrollbarX.thumb.background.fillOpacity = 0.1;

    // 5. Cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.stroke = am4core.color("#4facfe");
    chart.cursor.lineX.strokeDasharray = "3,3";
    chart.cursor.lineY.stroke = am4core.color("#4facfe");
    chart.cursor.lineY.strokeDasharray = "3,3";

    chartInstance.current = chart;

    return () => {
      chart.dispose();
    };
  }, [stockData, isLoggedIn]);

  // Render Login Prompt if not logged in
  if (!isLoggedIn) {
    return (
      <div className="prediction-container login-prompt">
        <h1 className="prediction-title">Access Restricted 🔒</h1>
        <div className="chart-card" style={{textAlign: 'center', padding: '50px'}}>
            <p style={{fontSize: '1.2rem', marginBottom: '20px'}}>You must be logged in to view stock predictions.</p>
            <Link to="/login" className="predict-btn">Login Now</Link>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="prediction-container">
      <h1 className="prediction-title">Market Forecast</h1>

      <div className="search-box-container">
        <div className="search-input-wrapper">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Company (e.g., Reliance, Tesla)..."
            className="stock-input"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((stock, index) => (
                <li key={index} onClick={() => selectStock(stock)}>
                  <span className="stock-name">{stock.name}</span>
                  <span className="stock-badge">{stock.se}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={fetchPrediction} className="predict-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span> Processing...
            </>
          ) : (
            "Predict"
          )}
        </button>
      </div> 

      {error && <div className="error-msg">⚠️ {error}</div>}

      {/* Chart Card */}
      {stockData.length > 0 && (
        <div className="chart-card">
             <div ref={chartDiv} className="chart-container" />
        </div>
      )}

      {/* Info Message */}
      {!loading && stockData.length === 0 && !error && (
        <div className="info-msg">
          <p>Start by typing a stock name above to view AI-driven predictions.</p>
        </div>
      )}
    </div>
  );
}

export default Prediction;