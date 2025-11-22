document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('skills-viz');
    if (!container) return;

    const width = container.clientWidth;
    const height = 300;

    const skills = [
        { id: "Data Science", group: 1, radius: 40 },
        { id: "Python", group: 2, radius: 30 },
        { id: "PyTorch", group: 2, radius: 25 },
        { id: "NLP", group: 3, radius: 30 },
        { id: "Computer Vision", group: 3, radius: 30 },
        { id: "MLOps", group: 4, radius: 25 },
        { id: "Docker", group: 4, radius: 20 },
        { id: "Flask", group: 4, radius: 20 },
        { id: "SQL", group: 5, radius: 20 },
        { id: "Statistics", group: 1, radius: 25 }
    ];

    const links = [
        { source: "Data Science", target: "Python" },
        { source: "Data Science", target: "Statistics" },
        { source: "Python", target: "PyTorch" },
        { source: "Python", target: "Flask" },
        { source: "Data Science", target: "NLP" },
        { source: "Data Science", target: "Computer Vision" },
        { source: "MLOps", target: "Docker" },
        { source: "MLOps", target: "Flask" },
        { source: "Data Science", target: "MLOps" },
        { source: "Data Science", target: "SQL" }
    ];

    const svg = d3.select("#skills-viz")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    const simulation = d3.forceSimulation(skills)
        .force("link", d3.forceLink(links).id(d => d.id).distance(70))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => d.radius + 5));

    const link = svg.append("g")
        .attr("stroke", "#94a3b8")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 1);

    const node = svg.append("g")
        .selectAll("g")
        .data(skills)
        .join("g")
        .call(drag(simulation));

    node.append("circle")
        .attr("r", d => d.radius)
        .attr("fill", d => {
            const colors = ["#38bdf8", "#818cf8", "#34d399", "#f472b6", "#fbbf24"];
            return colors[d.group % colors.length];
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);

    node.append("text")
        .text(d => d.id)
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("fill", "#fff") // Always white text for contrast on colored bubbles
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .style("pointer-events", "none");

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
});
