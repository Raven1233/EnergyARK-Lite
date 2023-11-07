export function linearInterpolation(x, minX, maxX, yList) {
    if (yList.length === 0) { 
        return 0; 
    } 
    else if (yList.length === 1) 
    { 
        return yList[0]; 
    }
    const xPartitionSize = (maxX - minX) / (yList.length - 1); 
    const xPartition = (x - minX) / xPartitionSize; 
    const xPartitionBelow = Math.floor(xPartition); 
    const yBelow = yList[xPartitionBelow]; 
    const yAbove = yList[Math.min(xPartitionBelow + 1, yList.length - 1)];
    const yAboveProp = xPartition - xPartitionBelow; 
    const yBelowProp = 1 - yAboveProp; 
    
    return yAboveProp * yAbove + yBelowProp * yBelow; 
}
   
   